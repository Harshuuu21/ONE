import crypto from 'crypto';
import { prisma } from '../../../config/database.js';
import { AAProviderFactory } from '../adapters/providers/provider.factory.js';
import { NotFoundError, BadRequestError } from '../../../shared/errors/index.js';
import { ENV } from '../../../config/env.js';

export class AAService {
  /**
   * Retrieves all verified & documented Account Aggregator providers
   */
  static getSupportedProviders() {
    return AAProviderFactory.listSupportedProviders();
  }

  /**
   * Initiates an AA connection journey with redirect generation
   */
  static async initiateConnection(userId: string, providerId: string, customCallbackUrl?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.mobileNumber) {
      throw new BadRequestError('User mobile number must be verified before connecting Account Aggregator');
    }

    const provider = AAProviderFactory.getProvider(providerId);

    // Generate cryptographically random correlationId
    const correlationId = `one_aa_${crypto.randomBytes(16).toString('hex')}`;
    const redirectCallbackUrl =
      customCallbackUrl || `${ENV.CLIENT_URL}/aa-gateway/callback?correlationId=${correlationId}`;

    const initiationResult = await provider.initiateConnection({
      userId,
      userMobile: user.mobileNumber,
      correlationId,
      redirectCallbackUrl,
    });

    // Create tracking AALinkingSession
    const session = await prisma.aaLinkingSession.create({
      data: {
        userId,
        providerId,
        correlationId,
        redirectUrl: initiationResult.redirectUrl,
        expiresAt: initiationResult.expiresAt,
      },
    });

    return {
      sessionId: session.id,
      correlationId,
      redirectUrl: initiationResult.redirectUrl,
      provider: provider.getMetadata(),
      expiresAt: initiationResult.expiresAt,
    };
  }

  /**
   * Retrieves all active AA connections for a user
   */
  static async listUserConnections(userId: string) {
    return prisma.aaConnection.findMany({
      where: { userId },
      include: {
        linkedAccounts: {
          where: { status: 'LINKED' },
        },
        consents: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Retrieves real-time status of a connection or linking session
   */
  static async getConnectionStatus(userId: string, idOrCorrelationId: string) {
    // Check if correlationId or session ID
    const session = await prisma.aaLinkingSession.findFirst({
      where: {
        userId,
        OR: [{ id: idOrCorrelationId }, { correlationId: idOrCorrelationId }],
      },
      include: {
        aaConnection: {
          include: {
            linkedAccounts: true,
          },
        },
      },
    });

    if (session) {
      return {
        type: 'SESSION',
        sessionStatus: session.status,
        providerId: session.providerId,
        discoveredAccounts: session.discoveredAccounts,
        connection: session.aaConnection,
      };
    }

    // Check AAConnection
    const connection = await prisma.aaConnection.findFirst({
      where: { id: idOrCorrelationId, userId },
      include: {
        linkedAccounts: true,
        consents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!connection) {
      throw new NotFoundError('Account Aggregator connection or session not found');
    }

    return {
      type: 'CONNECTION',
      connectionStatus: connection.status,
      connection,
    };
  }
}
