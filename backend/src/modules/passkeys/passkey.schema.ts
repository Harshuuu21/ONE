import { z } from 'zod';

export const registerOptionsSchema = z.object({
  body: z.object({
    deviceName: z.string().optional(),
  }),
});

export const registerVerifySchema = z.object({
  body: z.object({
    response: z.record(z.any()), // RegistrationResponseJSON from @simplewebauthn/browser
    deviceName: z.string().optional(),
  }),
});

export const loginOptionsSchema = z.object({
  body: z.object({
    mobileNumber: z.string().optional(),
  }),
});

export const loginVerifySchema = z.object({
  body: z.object({
    response: z.record(z.any()), // AuthenticationResponseJSON from @simplewebauthn/browser
    mobileNumber: z.string().optional(),
  }),
});

