import { prisma } from '../../config/database.js';
import { AAProviderFactory } from '../account-aggregator/adapters/providers/provider.factory.js';
import { RequestConsentInput, ConsentCallbackInput } from './consent.schema.js';
import { NotFoundError, BadRequestError } from '../../shared/errors/index.js';
import { ConsentStatus, ConsentEventType, CallbackStatus } from '@prisma/client';
import { ENV } from '../../config/env.js';

export class ConsentService {
  /**
   * Creates a formal ReBIT consent request for specified bank accounts
   */
  static async requestConsent(userId: string, input: RequestConsentInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Fetch the target linked accounts
    const linkedAccounts = await prisma.linkedBankAccount.findMany({
      where: {
        id: { in: input.accountIds },
        userId,
      },
    });

    if (linkedAccounts.length === 0) {
      throw new BadRequestError('None of the specified accounts were found or belong to you');
    }

    const provider = AAProviderFactory.getProvider(input.providerId);

    const now = new Date();
    const dataRangeFrom = input.dataRangeFrom ? new Date(input.dataRangeFrom) : new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000); // Past 6 months
    const dataRangeTo = input.dataRangeTo ? new Date(input.dataRangeTo) : now;
    const validUntil = new Date(now.getTime() + (input.durationDays || 365) * 24 * 60 * 60 * 1000); // Default 1 year

    // Initiate consent request with AA provider
    const consentResult = await provider.createConsentRequest({
      customerHandle: user.mobileNumber || `user_${user.id.substring(0, 8)}`,
      purpose: input.purpose,
      dataTypes: input.dataTypes,
      dataRangeFrom,
      dataRangeTo,
      fetchFrequency: input.fetchFrequency,
      validUntil,
      accounts: linkedAccounts.map((a) => ({
        fipId: a.fipId,
        accountRefNumber: a.accountRefNumber,
        accountNumberMasked: a.accountNumberMasked,
      })),
      redirectCallbackUrl: `${ENV.CLIENT_URL}/aa-gateway/consent-callback`,
    });

    // Create Consent record
    const consent = await prisma.consent.create({
      data: {
        userId,
        consentHandle: consentResult.consentHandle,
        purpose: input.purpose,
        dataTypes: input.dataTypes,
        status: ConsentStatus.PENDING,
        dataRangeFrom,
        dataRangeTo,
        fetchFrequency: input.fetchFrequency,
        validUntil,
        accounts: input.accountIds,
        metadata: {
          providerId: input.providerId,
          providerName: provider.getMetadata().name,
          durationDays: input.durationDays,
        },
      },
    });

    // Record initial ConsentEvent
    await prisma.consentEvent.create({
      data: {
        consentId: consent.id,
        eventType: ConsentEventType.REQUESTED,
        actor: 'USER',
        reason: 'Initial consent creation requested by user',
        payload: {
          purpose: input.purpose,
          accountsCount: linkedAccounts.length,
          dataTypes: input.dataTypes,
        },
      },
    });

    return {
      consentId: consent.id,
      consentHandle: consent.consentHandle,
      status: consent.status,
      redirectUrl: consentResult.redirectUrl,
      validUntil: consent.validUntil,
    };
  }

  /**
   * Lists all consent authorizations and their lifecycle history for a user
   */
  static async listUserConsents(userId: string) {
    return prisma.consent.findMany({
      where: { userId },
      include: {
        events: {
          orderBy: { createdAt: 'desc' },
        },
        aaConnection: {
          select: {
            id: true,
            providerName: true,
            providerId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves specific consent details and synchronizes latest status if pending
   */
  static async getConsent(userId: string, consentIdOrHandle: string) {
    const consent = await prisma.consent.findFirst({
      where: {
        userId,
        OR: [{ id: consentIdOrHandle }, { consentHandle: consentIdOrHandle }],
      },
      include: {
        events: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!consent) {
      throw new NotFoundError('Consent record not found');
    }

    // If still pending, check latest state from provider
    if (consent.status === ConsentStatus.PENDING && consent.metadata) {
      const meta = consent.metadata as Record<string, any>;
      if (meta.providerId) {
        try {
          const provider = AAProviderFactory.getProvider(meta.providerId);
          const statusResult = await provider.getConsentStatus(consent.consentHandle);

          if (statusResult.status !== ConsentStatus.PENDING) {
            const updated = await prisma.consent.update({
              where: { id: consent.id },
              data: {
                status: statusResult.status,
                consentId: statusResult.consentId || undefined,
                grantedAt: statusResult.status === ConsentStatus.APPROVED ? new Date() : undefined,
              },
            });

            await prisma.consentEvent.create({
              data: {
                consentId: consent.id,
                eventType:
                  statusResult.status === ConsentStatus.APPROVED
                    ? ConsentEventType.APPROVED
                    : ConsentEventType.REJECTED,
                actor: 'AA_PROVIDER',
                reason: `Status sync from provider: ${statusResult.status}`,
              },
            });

            return updated;
          }
        } catch (e) {
          console.warn('[ConsentService] Status poll failed:', e);
        }
      }
    }

    return consent;
  }

  /**
   * Revokes an existing active consent
   */
  static async revokeConsent(userId: string, consentId: string, reason?: string) {
    const consent = await prisma.consent.findFirst({
      where: { id: consentId, userId },
    });

    if (!consent) {
      throw new NotFoundError('Consent record not found');
    }

    if (consent.status === ConsentStatus.REVOKED) {
      return { success: true, message: 'Consent already revoked', consent };
    }

    const updated = await prisma.consent.update({
      where: { id: consentId },
      data: {
        status: ConsentStatus.REVOKED,
        revokedAt: new Date(),
      },
    });

    // Record immutable ConsentEvent
    await prisma.consentEvent.create({
      data: {
        consentId,
        eventType: ConsentEventType.REVOKED,
        actor: 'USER',
        reason: reason || 'Explicit user revocation via ONE privacy settings',
      },
    });

    return {
      success: true,
      message: 'Consent revoked successfully. Further financial data fetches are prohibited.',
      consent: updated,
    };
  }

  /**
   * Handles authenticated consent callback from the AA provider
   */
  static async handleCallback(headers: Record<string, any>, body: ConsentCallbackInput) {
    const { providerId, consentHandle, consentId, status, metadata } = body;

    const provider = AAProviderFactory.getProvider(providerId);
    const isValidSignature = provider.verifyCallbackSignature(headers, body);

    if (!isValidSignature) {
      await prisma.providerCallbackEvent.create({
        data: {
          providerId,
          correlationId: consentHandle,
          eventType: 'CONSENT_CALLBACK',
          payload: body,
          status: CallbackStatus.INVALID_SIGNATURE,
          errorMessage: 'Invalid consent callback signature',
        },
      });
      throw new BadRequestError('Invalid consent callback signature');
    }

    const consent = await prisma.consent.findUnique({
      where: { consentHandle },
    });

    if (!consent) {
      throw new NotFoundError(`Consent not found for handle: ${consentHandle}`);
    }

    let nextStatus: ConsentStatus = ConsentStatus.PENDING;
    let eventType: ConsentEventType = ConsentEventType.APPROVED;

    if (status === 'APPROVED') {
      nextStatus = ConsentStatus.APPROVED;
      eventType = ConsentEventType.APPROVED;
    } else if (status === 'REJECTED') {
      nextStatus = ConsentStatus.REJECTED;
      eventType = ConsentEventType.REJECTED;
    } else if (status === 'EXPIRED') {
      nextStatus = ConsentStatus.EXPIRED;
      eventType = ConsentEventType.EXPIRED;
    } else if (status === 'REVOKED') {
      nextStatus = ConsentStatus.REVOKED;
      eventType = ConsentEventType.REVOKED;
    }

    const updated = await prisma.consent.update({
      where: { id: consent.id },
      data: {
        status: nextStatus,
        consentId: consentId || consent.consentId || undefined,
        grantedAt: status === 'APPROVED' ? new Date() : undefined,
        revokedAt: status === 'REVOKED' ? new Date() : undefined,
        metadata: metadata ? { ...(consent.metadata as any), ...metadata } : undefined,
      },
    });

    await prisma.consentEvent.create({
      data: {
        consentId: consent.id,
        eventType,
        actor: 'AA_PROVIDER',
        reason: `Callback event: ${status}`,
        payload: body,
      },
    });

    await prisma.providerCallbackEvent.create({
      data: {
        providerId,
        correlationId: consentHandle,
        eventType: 'CONSENT_CALLBACK',
        payload: body,
        status: CallbackStatus.PROCESSED,
      },
    });

    return {
      success: true,
      consentHandle,
      status: nextStatus,
    };
  }
}
