import crypto from 'crypto';
import { prisma } from '../../../config/database.js';
import { ENV } from '../../../config/env.js';
import { BadRequestError } from '../../../shared/errors/index.js';

export interface SendOtpResult {
  mobileNumber: string;
  expiresInSeconds: number;
  cooldownSeconds: number;
  // Dev only mock code surfaced in dev mode
  devMockOtp?: string;
}

export class OtpService {
  /**
   * Hashes an OTP with a fixed salt
   */
  private static hashOtp(otp: string, mobileNumber: string): string {
    return crypto
      .createHash('sha256')
      .update(`${mobileNumber}:${otp}:${ENV.JWT_SECRET}`)
      .digest('hex');
  }

  /**
   * Normalizes an Indian mobile number to format: +91XXXXXXXXXX
   */
  public static normalizeMobile(input: string): string {
    const cleaned = input.replace(/\D/g, '');
    if (cleaned.length === 10) {
      if (!/^[6-9]\d{9}$/.test(cleaned)) {
        throw new BadRequestError('Invalid Indian mobile number format');
      }
      return `+91${cleaned}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      const tenDigit = cleaned.substring(2);
      if (!/^[6-9]\d{9}$/.test(tenDigit)) {
        throw new BadRequestError('Invalid Indian mobile number format');
      }
      return `+91${tenDigit}`;
    }
    throw new BadRequestError('Please provide a valid 10-digit Indian mobile number');
  }

  /**
   * Generates a cryptographically secure 6-digit OTP
   */
  private static generateNumericOtp(): string {
    const buffer = crypto.randomBytes(3);
    const value = buffer.readUIntBE(0, 3) % 1000000;
    return value.toString().padStart(6, '0');
  }

  /**
   * Requests a new OTP for a given mobile number
   */
  static async requestOtp(rawMobile: string): Promise<SendOtpResult> {
    const mobileNumber = this.normalizeMobile(rawMobile);

    // 1. Rate limiting check: check last requested OTP for cooldown
    const latestOtp = await prisma.otpVerification.findFirst({
      where: { mobileNumber },
      orderBy: { createdAt: 'desc' },
    });

    if (latestOtp) {
      const elapsedSeconds = Math.floor((Date.now() - latestOtp.createdAt.getTime()) / 1000);
      if (elapsedSeconds < ENV.OTP_COOLDOWN_SECONDS) {
        const remaining = ENV.OTP_COOLDOWN_SECONDS - elapsedSeconds;
        throw new BadRequestError(`Please wait ${remaining} seconds before requesting a new OTP`);
      }
    }

    // 2. Hourly rate limit check (max 5 OTPs per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const countLastHour = await prisma.otpVerification.count({
      where: {
        mobileNumber,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (countLastHour >= 5) {
      throw new BadRequestError('Too many OTP requests for this number. Please try again after 1 hour');
    }

    // 3. Invalidate any existing active OTPs for this number
    await prisma.otpVerification.updateMany({
      where: { mobileNumber, isUsed: false },
      data: { isUsed: true },
    });

    // 4. Generate new OTP and hash
    const plainOtp = this.generateNumericOtp();
    const otpHash = this.hashOtp(plainOtp, mobileNumber);
    const expiresAt = new Date(Date.now() + ENV.OTP_EXPIRES_MINUTES * 60 * 1000);

    await prisma.otpVerification.create({
      data: {
        mobileNumber,
        otpHash,
        attempts: 0,
        maxAttempts: ENV.OTP_MAX_ATTEMPTS,
        expiresAt,
        isUsed: false,
      },
    });

    // 5. Send via configured SMS provider
    if (ENV.SMS_PROVIDER === 'mock' || ENV.NODE_ENV !== 'production') {
      console.log(`\n========================================`);
      console.log(`[ONE DEV SMS] Mobile: ${mobileNumber} | OTP: ${plainOtp}`);
      console.log(`========================================\n`);
    } else {
      // In production, delegate to SMS Gateway (Twilio/AWS SNS/GupShup/MSG91)
      // await SmsGateway.sendOtp(mobileNumber, plainOtp);
    }

    return {
      mobileNumber,
      expiresInSeconds: ENV.OTP_EXPIRES_MINUTES * 60,
      cooldownSeconds: ENV.OTP_COOLDOWN_SECONDS,
      devMockOtp: ENV.NODE_ENV !== 'production' ? plainOtp : undefined,
    };
  }

  /**
   * Verifies an OTP against the stored hash
   */
  static async verifyOtp(rawMobile: string, otp: string): Promise<boolean> {
    const mobileNumber = this.normalizeMobile(rawMobile);

    const record = await prisma.otpVerification.findFirst({
      where: {
        mobileNumber,
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestError('No active OTP found. Please request a new verification code');
    }

    if (new Date() > record.expiresAt) {
      await prisma.otpVerification.update({
        where: { id: record.id },
        data: { isUsed: true },
      });
      throw new BadRequestError('OTP has expired. Please request a new code');
    }

    if (record.attempts >= record.maxAttempts) {
      await prisma.otpVerification.update({
        where: { id: record.id },
        data: { isUsed: true },
      });
      throw new BadRequestError('Maximum verification attempts exceeded. Please request a new code');
    }

    const computedHash = this.hashOtp(otp.trim(), mobileNumber);
    const isValid = computedHash === record.otpHash;

    if (!isValid) {
      // Increment attempts
      const updated = await prisma.otpVerification.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      const remaining = record.maxAttempts - updated.attempts;
      if (remaining <= 0) {
        await prisma.otpVerification.update({
          where: { id: record.id },
          data: { isUsed: true },
        });
        throw new BadRequestError('Incorrect OTP. Maximum attempts reached. Request a new code');
      }
      throw new BadRequestError(`Incorrect OTP. ${remaining} attempt(s) remaining`);
    }

    // Mark as used to prevent replay attacks
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { isUsed: true },
    });

    return true;
  }
}

