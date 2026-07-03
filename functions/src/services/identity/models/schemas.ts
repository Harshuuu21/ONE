import { z } from "zod";

export const RegisterUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    displayName: z.string().min(2),
    device: z.string().optional(),
    platform: z.string().optional(),
    appVersion: z.string().optional(),
    correlationId: z.string().optional()
});

export type RegisterUserPayload = z.infer<typeof RegisterUserSchema>;
