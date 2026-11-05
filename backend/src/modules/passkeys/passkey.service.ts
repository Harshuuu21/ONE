import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { prisma } from '../../config/database.js';
import { ENV } from '../../config/env.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../shared/errors/index.js';
import { SessionService } from '../authentication/services/session.service.js';
import { AuditService } from '../authentication/services/audit.service.js';

export class PasskeyService {
  /**
   * Generates WebAuthn registration options for an authenticated user
   */
  static async generateRegistrationOptions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { passkeys: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Exclude existing credentials
    const excludeCredentials = user.passkeys.map((p) => ({
      id: p.credentialId,
      transports: p.transports as any,
    }));

    // Convert string ID to Uint8Array
    const userID = Buffer.from(user.id, 'utf-8');

    const options = await generateRegistrationOptions({
      rpName: ENV.RP_NAME,
      rpID: ENV.RP_ID,
      userID,
      userName: user.mobileNumber || user.email || `user_${user.id.substring(0, 8)}`,
      userDisplayName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'ONE Member',
      attestationType: 'none',
      excludeCredentials,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    // Store challenge in DB with 5-minute expiry
    await prisma.passkeyChallenge.create({
      data: {
        userId: user.id,
        challenge: options.challenge,
        type: 'REGISTRATION',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return options;
  }

  /**
   * Verifies WebAuthn registration response and persists the public key credential
   */
  static async verifyRegistration(
    userId: string,
    body: any,
    deviceName?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    // 1. Look up active registration challenge
    const challengeRecord = await prisma.passkeyChallenge.findFirst({
      where: {
        userId,
        type: 'REGISTRATION',
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!challengeRecord) {
      throw new BadRequestError('Registration challenge expired or missing. Please try again.');
    }

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: challengeRecord.challenge,
        expectedOrigin: ENV.ORIGIN,
        expectedRPID: ENV.RP_ID,
        requireUserVerification: false,
      });
    } catch (err: any) {
      await AuditService.logEvent({
        userId,
        event: 'PASSKEY_REGISTRATION_FAILED',
        status: 'FAILURE',
        ipAddress,
        userAgent,
        metadata: { error: err.message },
      });
      throw new BadRequestError(`Passkey registration failed: ${err.message}`);
    }

    if (!verification.verified || !verification.registrationInfo) {
      throw new BadRequestError('Passkey verification could not be confirmed.');
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    // Resolve or associate user device
    const device = await SessionService.resolveDevice(userId, userAgent, ipAddress);

    // Save Passkey Credential (storing ONLY public key and credential metadata, never biometrics)
    const passkey = await prisma.passkeyCredential.create({
      data: {
        userId,
        deviceId: device.id,
        credentialId: credential.id,
        publicKey: Buffer.from(credential.publicKey),
        counter: BigInt(credential.counter),
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports: (credential.transports as string[]) || [],
      },
    });

    // Update user onboarding status
    await prisma.user.update({
      where: { id: userId },
      data: { onboardingStep: 'ACTIVE' },
    });

    // Cleanup challenge
    await prisma.passkeyChallenge.deleteMany({
      where: { userId, type: 'REGISTRATION' },
    });

    await AuditService.logEvent({
      userId,
      event: 'PASSKEY_REGISTERED',
      status: 'SUCCESS',
      ipAddress,
      userAgent,
      metadata: { credentialId: passkey.credentialId, deviceName: device.deviceName },
    });

    return {
      success: true,
      passkeyId: passkey.id,
      deviceName: device.deviceName,
    };
  }

  /**
   * Generates WebAuthn authentication/login options
   */
  static async generateLoginOptions(rawMobile?: string) {
    let allowCredentials = undefined;
    let userId: string | null = null;

    if (rawMobile) {
      const cleaned = rawMobile.replace(/\D/g, '');
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { mobileNumber: `+91${cleaned.slice(-10)}` },
            { mobileNumber: cleaned },
          ],
        },
        include: { passkeys: true },
      });

      if (user && user.passkeys.length > 0) {
        userId = user.id;
        allowCredentials = user.passkeys.map((p) => ({
          id: p.credentialId,
          transports: p.transports as any,
        }));
      }
    }

    const options = await generateAuthenticationOptions({
      rpID: ENV.RP_ID,
      allowCredentials,
      userVerification: 'preferred',
    });

    // Save challenge
    await prisma.passkeyChallenge.create({
      data: {
        userId,
        challenge: options.challenge,
        type: 'AUTHENTICATION',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return options;
  }

  /**
   * Verifies WebAuthn assertion and creates an authenticated session
   */
  static async verifyLogin(body: any, ipAddress?: string, userAgent?: string) {
    const credentialId = body.id;

    // Find passkey by credentialId
    const passkey = await prisma.passkeyCredential.findUnique({
      where: { credentialId },
      include: { user: true },
    });

    if (!passkey) {
      throw new NotFoundError('Passkey not recognized or not registered with this account.');
    }

    // Find challenge
    const challengeRecord = await prisma.passkeyChallenge.findFirst({
      where: {
        type: 'AUTHENTICATION',
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!challengeRecord) {
      throw new BadRequestError('Login challenge expired. Please retry passkey authentication.');
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge: challengeRecord.challenge,
        expectedOrigin: ENV.ORIGIN,
        expectedRPID: ENV.RP_ID,
        credential: {
          id: passkey.credentialId,
          publicKey: new Uint8Array(passkey.publicKey),
          counter: Number(passkey.counter),
        },
        requireUserVerification: false,
      });
    } catch (err: any) {
      await AuditService.logEvent({
        userId: passkey.userId,
        event: 'PASSKEY_LOGIN_FAILED',
        status: 'FAILURE',
        ipAddress,
        userAgent,
        metadata: { error: err.message },
      });
      throw new UnauthorizedError(`Passkey authentication failed: ${err.message}`);
    }

    if (!verification.verified) {
      throw new UnauthorizedError('Passkey authentication verification failed.');
    }

    // Update counter & lastUsedAt
    await prisma.passkeyCredential.update({
      where: { id: passkey.id },
      data: {
        counter: BigInt(verification.authenticationInfo.newCounter),
        lastUsedAt: new Date(),
      },
    });

    // Cleanup challenge
    await prisma.passkeyChallenge.deleteMany({
      where: { id: challengeRecord.id },
    });

    // Create session
    const tokens = await SessionService.createSession(
      passkey.userId,
      passkey.user.role,
      ipAddress,
      userAgent
    );

    await AuditService.logEvent({
      userId: passkey.userId,
      event: 'PASSKEY_LOGIN_SUCCESS',
      status: 'SUCCESS',
      ipAddress,
      userAgent,
      metadata: { credentialId: passkey.credentialId },
    });

    return {
      user: {
        id: passkey.user.id,
        mobileNumber: passkey.user.mobileNumber,
        firstName: passkey.user.firstName,
        lastName: passkey.user.lastName,
        isMobileVerified: passkey.user.isMobileVerified,
        onboardingStep: passkey.user.onboardingStep,
        reputationScore: passkey.user.reputationScore,
        reputationTitle: passkey.user.reputationTitle,
      },
      tokens,
    };
  }

  /**
   * Lists all registered passkeys for a user (device management)
   */
  static async listUserPasskeys(userId: string) {
    return prisma.passkeyCredential.findMany({
      where: { userId },
      select: {
        id: true,
        credentialId: true,
        deviceType: true,
        backedUp: true,
        createdAt: true,
        lastUsedAt: true,
        device: {
          select: {
            id: true,
            deviceName: true,
            lastActiveAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Revokes/deletes a passkey
   */
  static async deletePasskey(userId: string, passkeyId: string) {
    const passkey = await prisma.passkeyCredential.findFirst({
      where: { id: passkeyId, userId },
    });

    if (!passkey) {
      throw new NotFoundError('Passkey not found');
    }

    await prisma.passkeyCredential.delete({
      where: { id: passkeyId },
    });

    await AuditService.logEvent({
      userId,
      event: 'PASSKEY_REVOKED',
      status: 'SUCCESS',
      metadata: { passkeyId },
    });

    return { success: true };
  }
}

