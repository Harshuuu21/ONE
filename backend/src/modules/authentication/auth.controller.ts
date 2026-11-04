import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from './auth.service.js';
import { SessionService } from './services/session.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { BadRequestError } from '../../shared/errors/index.js';

export class AuthenticationController {
  static async requestOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const ua = req.headers['user-agent'];
      const result = await AuthenticationService.requestOtp(req.body.mobileNumber, ip, ua);
      return sendSuccess(res, result, 'Verification OTP sent to your mobile number');
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const ua = req.headers['user-agent'];
      const result = await AuthenticationService.verifyOtp(
        req.body.mobileNumber,
        req.body.otp,
        ip,
        ua
      );

      // Set rotating refresh token in HttpOnly secure cookie
      res.cookie('one_refresh_token', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return sendSuccess(res, result, 'Mobile number verified successfully');
    } catch (error) {
      next(error);
    }
  }

  static async identify(req: Request, res: Response, next: NextFunction) {
    try {
      const mobileNumber = req.body.mobileNumber || (req.query.mobileNumber as string);
      if (!mobileNumber) {
        throw new BadRequestError('Mobile number is required');
      }
      const result = await AuthenticationService.identifyUser(mobileNumber);
      return sendSuccess(res, result, 'User identified');
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.one_refresh_token || req.body.refreshToken;
      if (!token) {
        throw new BadRequestError('Refresh token required');
      }

      const ip = req.ip || req.socket.remoteAddress;
      const ua = req.headers['user-agent'];
      const tokens = await SessionService.rotateSession(token, ip, ua);

      res.cookie('one_refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return sendSuccess(res, tokens, 'Tokens refreshed');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.one_refresh_token || req.body.refreshToken;
      if (token) {
        await SessionService.revokeSession(token);
      }
      res.clearCookie('one_refresh_token');
      return sendSuccess(res, { loggedOut: true }, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async logoutAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await SessionService.revokeAllUserSessions(req.user!.id);
      res.clearCookie('one_refresh_token');
      return sendSuccess(res, { revokedAll: true }, 'Logged out from all devices');
    } catch (error) {
      next(error);
    }
  }

  static async listSessions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sessions = await SessionService.listUserSessions(req.user!.id);
      return sendSuccess(res, sessions, 'Active sessions retrieved');
    } catch (error) {
      next(error);
    }
  }
}
