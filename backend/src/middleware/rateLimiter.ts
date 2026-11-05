import { Request, Response, NextFunction } from 'express';
import { TooManyRequestsError } from '../shared/errors/index.js';

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitStore>();

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

export function rateLimiter(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = 'Too many requests. Please try again later.',
    keyGenerator = (req: Request) => req.ip || req.socket.remoteAddress || 'unknown_ip',
  } = options;

  return (req: Request, _res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const record = memoryStore.get(key);

    if (!record || now > record.resetAt) {
      memoryStore.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      const waitSeconds = Math.ceil((record.resetAt - now) / 1000);
      return next(new TooManyRequestsError(`${message} Wait ${waitSeconds} seconds.`));
    }

    record.count++;
    return next();
  };
}

// Pre-configured rate limiters for sensitive auth endpoints
export const otpRequestLimiter = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: 'Too many OTP requests from this address.',
  keyGenerator: (req) => `${req.ip}_${req.body?.mobileNumber || ''}`,
});

export const otpVerifyLimiter = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: 'Too many failed verification attempts.',
  keyGenerator: (req) => `${req.ip}_${req.body?.mobileNumber || ''}`,
});

