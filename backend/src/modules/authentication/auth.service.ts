import { prisma } from '../../config/database.js';
import { OtpService } from './services/otp.service.js';
import { SessionService } from './services/session.service.js';
import { AuditService } from './services/audit.service.js';

export interface VerifyOtpResult {
  user: {
    id: string;
    mobileNumber: string;
    firstName: string | null;
    lastName: string | null;
    isMobileVerified: boolean;
    onboardingStep: string;
    reputationScore: number;
    reputationTitle: string;
  };
  isNewUser: boolean;
  hasPasskey: boolean;
  nextStep: 'PASSKEY_LOGIN' | 'AA_ONBOARDING' | 'PASSKEY_REGISTRATION' | 'DASHBOARD';
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export class AuthenticationService {
  /**
   * Request OTP for mobile authentication
   */
  static async requestOtp(rawMobile: string, ipAddress?: string, userAgent?: string) {
    try {
      const result = await OtpService.requestOtp(rawMobile);
      await AuditService.logEvent({
        mobileNumber: result.mobileNumber,
        event: 'OTP_REQUESTED',
        status: 'SUCCESS',
        ipAddress,
        userAgent,
      });
      return result;
    } catch (error: any) {
      await AuditService.logEvent({
        mobileNumber: rawMobile,
        event: 'OTP_REQUEST_FAILED',
        status: 'FAILURE',
        ipAddress,
        userAgent,
        metadata: { error: error.message },
      });
      throw error;
    }
  }

  /**
   * Verify OTP and authenticate or provision user
   */
  static async verifyOtp(
    rawMobile: string,
    otp: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<VerifyOtpResult> {
    const mobileNumber = OtpService.normalizeMobile(rawMobile);

    try {
      // 1. Verify OTP
      await OtpService.verifyOtp(mobileNumber, otp);

      // 2. Discover or provision user
      let user = await prisma.user.findUnique({
        where: { mobileNumber },
        include: {
          passkeys: true,
        },
      });

      let isNewUser = false;

      if (!user) {
        // Provision new user
        isNewUser = true;
        user = await prisma.user.create({
          data: {
            mobileNumber,
            isMobileVerified: true,
            onboardingStep: 'ONBOARDING_PENDING',
            reputationScore: 780,
            reputationTitle: 'Reliable Peer',
          },
          include: {
            passkeys: true,
          },
        });
      } else if (!user.isMobileVerified) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { isMobileVerified: true },
          include: {
            passkeys: true,
          },
        });
      }

      // 3. Issue session tokens
      const tokens = await SessionService.createSession(
        user.id,
        user.role,
        ipAddress,
        userAgent
      );

      // 4. Determine next step
      const hasPasskey = user.passkeys.length > 0;
      let nextStep: VerifyOtpResult['nextStep'] = 'DASHBOARD';

      if (isNewUser) {
        nextStep = 'AA_ONBOARDING';
      } else if (hasPasskey) {
        nextStep = 'DASHBOARD'; // User already completed phone OTP verification
      } else {
        nextStep = 'PASSKEY_REGISTRATION';
      }

      await AuditService.logEvent({
        userId: user.id,
        mobileNumber,
        event: 'OTP_VERIFIED',
        status: 'SUCCESS',
        ipAddress,
        userAgent,
        metadata: { isNewUser, hasPasskey, nextStep },
      });

      return {
        user: {
          id: user.id,
          mobileNumber: user.mobileNumber!,
          firstName: user.firstName,
          lastName: user.lastName,
          isMobileVerified: user.isMobileVerified,
          onboardingStep: user.onboardingStep,
          reputationScore: user.reputationScore,
          reputationTitle: user.reputationTitle,
        },
        isNewUser,
        hasPasskey,
        nextStep,
        tokens,
      };
    } catch (error: any) {
      await AuditService.logEvent({
        mobileNumber,
        event: 'OTP_VERIFY_FAILED',
        status: 'FAILURE',
        ipAddress,
        userAgent,
        metadata: { error: error.message },
      });
      throw error;
    }
  }

  /**
   * Identifies user by mobile number before passkey login
   */
  static async identifyUser(rawMobile: string) {
    const mobileNumber = OtpService.normalizeMobile(rawMobile);
    const user = await prisma.user.findUnique({
      where: { mobileNumber },
      include: {
        passkeys: {
          select: {
            id: true,
            credentialId: true,
            deviceType: true,
            transports: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return {
        exists: false,
        hasPasskey: false,
        mobileNumber,
      };
    }

    return {
      exists: true,
      hasPasskey: user.passkeys.length > 0,
      mobileNumber,
      userId: user.id,
      firstName: user.firstName,
    };
  }
}
