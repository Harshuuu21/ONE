import { Request, Response, NextFunction } from 'express';
import { PasskeyService } from './passkey.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class PasskeyController {
  static async registerOptions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const options = await PasskeyService.generateRegistrationOptions(req.user!.id);
      return sendSuccess(res, options, 'Registration options generated');
    } catch (error) {
      next(error);
    }
  }

  static async registerVerify(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const ua = req.headers['user-agent'];
      const result = await PasskeyService.verifyRegistration(
        req.user!.id,
        req.body.response,
        req.body.deviceName,
        ip,
        ua
      );
      return sendSuccess(res, result, 'Passkey registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async loginOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const mobileNumber = req.body.mobileNumber || (req.query.mobileNumber as string);
      const options = await PasskeyService.generateLoginOptions(mobileNumber);
      return sendSuccess(res, options, 'Authentication options generated');
    } catch (error) {
      next(error);
    }
  }

  static async loginVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const ua = req.headers['user-agent'];
      const result = await PasskeyService.verifyLogin(req.body.response, ip, ua);

      // Set rotating refresh token in secure HttpOnly cookie
      res.cookie('one_refresh_token', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return sendSuccess(res, result, 'Passkey login successful');
    } catch (error) {
      next(error);
    }
  }

  static async listPasskeys(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const passkeys = await PasskeyService.listUserPasskeys(req.user!.id);
      return sendSuccess(res, passkeys, 'User passkeys retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async deletePasskey(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await PasskeyService.deletePasskey(req.user!.id, req.params.id as string);
      return sendSuccess(res, result, 'Passkey revoked successfully');
    } catch (error) {
      next(error);
    }
  }
}

