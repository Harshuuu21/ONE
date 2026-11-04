import { z } from 'zod';

export const requestOtpSchema = z.object({
  body: z.object({
    mobileNumber: z
      .string()
      .min(10, 'Mobile number must be at least 10 digits')
      .max(15, 'Mobile number is too long'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    mobileNumber: z.string().min(10, 'Valid mobile number is required'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>['body'];
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>['body'];
