import { prisma } from '../../../config/database.js';
import { AAProviderFactory } from '../adapters/providers/provider.factory.js';
import { CallbackStatus, AALinkingSessionStatus, AAConnectionStatus } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../../shared/errors/index.js';

export interface CallbackRequestData {
  headers: Record<string, any>;
  body: {
    providerId: string;
    correlationId: string;
    status: 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'APPROVED' | 'REJECTED';
    consentHandle?: string;
    customerHandle?: string;
    discoveredAccounts?: any[];
    errorReason?: string;
  };
}

export class AACallbackHandler {
  /**
   * Idempotently processes an authenticated Account Aggregator provider callback
   */
  static async processCallback(data: CallbackRequestData) {
    const { providerId, correlationId, status, consentHandle, customerHandle, discoveredAccounts, errorReason } =
      data.body;

    // 1. Resolve Provider and verify signature
    const provider = AAProviderFactory.getProvider(providerId);
    const isSignatureValid = provider.verifyCallbackSignature(data.headers, data.body);

    if (!isSignatureValid) {
      await prisma.providerCallbackEvent.create({
        data: {
          providerId,
          correlationId,
          eventType: 'ACCOUNT_LINKING_CALLBACK',
          signature: data.headers['x-aa-signature'] || data.headers['x-jws-signature'] || null,
          payload: data.body,
          status: CallbackStatus.INVALID_SIGNATURE,
          errorMessage: 'Invalid callback cryptographic signature',
        },
      });
      throw new BadRequestError('Invalid AA callback signature');
    }

    // 2. Validate Linking Session and correlation token
    const session = await prisma.aaLinkingSession.findUnique({
      where: { correlationId },
      include: { user: true, aaConnection: true },
    });

    if (!session) {
      throw new NotFoundError(`No active AA linking session found for correlation ID: ${correlationId}`);
    }

    // 3. Prevent duplicate callbacks / ensure idempotency
    const existingCallback = await prisma.providerCallbackEvent.findFirst({
      where: {
        providerId,
        correlationId,
        status: CallbackStatus.PROCESSED,
      },
    });

    if (existingCallback) {
      console.log(`[AACallback] Duplicate callback received for correlationId: ${correlationId}, returning existing.`);
      return {
        alreadyProcessed: true,
        correlationId,
        status: session.status,
      };
    }

    // 4. Record callback event
    await prisma.providerCallbackEvent.create({
      data: {
        providerId,
        correlationId,
        eventType: 'ACCOUNT_LINKING_CALLBACK',
        signature: data.headers['x-aa-signature'] || null,
        payload: data.body,
        status: CallbackStatus.PROCESSED,
      },
    });

    // 5. Synchronize Linking Session & Connection Status
    let nextSessionStatus: AALinkingSessionStatus = AALinkingSessionStatus.FAILED;
    let nextConnectionStatus: AAConnectionStatus = AAConnectionStatus.FAILED;

    if (status === 'SUCCESS' || status === 'APPROVED') {
      nextSessionStatus = AALinkingSessionStatus.COMPLETED;
      nextConnectionStatus = AAConnectionStatus.ACTIVE;
    } else if (status === 'CANCELLED') {
      nextSessionStatus = AALinkingSessionStatus.CANCELLED;
      nextConnectionStatus = AAConnectionStatus.DISCONNECTED;
    }

    // Update session
    await prisma.aaLinkingSession.update({
      where: { id: session.id },
      data: {
        status: nextSessionStatus,
        discoveredAccounts: discoveredAccounts || session.discoveredAccounts || undefined,
        errorReason: errorReason || null,
      },
    });

    // Update or establish AA Connection
    if (session.aaConnectionId) {
      await prisma.aaConnection.update({
        where: { id: session.aaConnectionId },
        data: {
          status: nextConnectionStatus,
          aaCustomerHandle: customerHandle || undefined,
        },
      });
    } else {
      const conn = await prisma.aaConnection.upsert({
        where: {
          userId_providerId: {
            userId: session.userId,
            providerId,
          },
        },
        create: {
          userId: session.userId,
          providerId,
          providerName: provider.getMetadata().name,
          aaCustomerHandle: customerHandle || null,
          status: nextConnectionStatus,
        },
        update: {
          status: nextConnectionStatus,
          aaCustomerHandle: customerHandle || undefined,
        },
      });

      await prisma.aaLinkingSession.update({
        where: { id: session.id },
        data: { aaConnectionId: conn.id },
      });
    }

    return {
      success: true,
      correlationId,
      status: nextSessionStatus,
      userId: session.userId,
    };
  }
}
