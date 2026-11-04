import { prisma } from '../../config/database.js';
import { CreateConsentInput, UpdateConsentInput } from './consent.schema.js';
import { NotFoundError } from '../../shared/errors/index.js';

export class ConsentService {
  static async listUserConsents(userId: string) {
    return prisma.consent.findMany({
      where: { userId },
      orderBy: { grantedAt: 'desc' },
    });
  }

  static async grantConsent(userId: string, input: CreateConsentInput) {
    return prisma.consent.create({
      data: {
        userId,
        purpose: input.purpose,
        validUntil: new Date(input.validUntil),
        metadata: input.metadata,
      },
    });
  }

  static async updateConsentStatus(userId: string, consentId: string, input: UpdateConsentInput) {
    const consent = await prisma.consent.findFirst({
      where: { id: consentId, userId },
    });

    if (!consent) {
      throw new NotFoundError('Consent record not found');
    }

    return prisma.consent.update({
      where: { id: consentId },
      data: { status: input.status },
    });
  }
}

