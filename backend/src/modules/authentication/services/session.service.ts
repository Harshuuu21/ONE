import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../config/database.js';
import { ENV } from '../../../config/env.js';
import { UnauthorizedError } from '../../../shared/errors/index.js';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // in seconds
}

export class SessionService {
  /**
   * Hashes a refresh token for safe storage in the database
   */
  private static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Creates or resolves a UserDevice
   */
  static async resolveDevice(userId: string, userAgent?: string, ipAddress?: string) {
    const rawUa = userAgent || 'Unknown Device';
    let deviceName = 'Browser / Web Client';
    if (/iPhone|iPad/i.test(rawUa)) deviceName = 'Apple Mobile';
    else if (/Android/i.test(rawUa)) deviceName = 'Android Mobile';
    else if (/Macintosh|Mac OS/i.test(rawUa)) deviceName = 'Mac Desktop';
    else if (/Windows/i.test(rawUa)) deviceName = 'Windows PC';
    else if (/Linux/i.test(rawUa)) deviceName = 'Linux Client';

    // Find existing device or create new
    let device = await prisma.userDevice.findFirst({
      where: {
        userId,
        userAgent: rawUa,
      },
    });

    if (device) {
      device = await prisma.userDevice.update({
        where: { id: device.id },
        data: {
          lastActiveAt: new Date(),
          ipAddress: ipAddress || device.ipAddress,
        },
      });
    } else {
      device = await prisma.userDevice.create({
        data: {
          userId,
          deviceName,
          userAgent: rawUa,
          ipAddress: ipAddress || null,
        },
      });
    }

    return device;
  }

  /**
   * Issues a short-lived access token and a rotating refresh token, storing the hash in DB
   */
  static async createSession(
    userId: string,
    role: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<TokenPair> {
    const device = await this.resolveDevice(userId, userAgent, ipAddress);

    // Generate access token (15 mins)
    const accessToken = jwt.sign(
      { id: userId, role, deviceId: device.id },
      ENV.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Generate random refresh token
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + ENV.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

    // Save session in DB
    await prisma.userSession.create({
      data: {
        userId,
        deviceId: device.id,
        refreshTokenHash,
        expiresAt,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 15 * 60,
    };
  }

  /**
   * Rotates a refresh token: invalidates old token and issues a new pair
   */
  static async rotateSession(rawRefreshToken: string, ipAddress?: string, userAgent?: string): Promise<TokenPair> {
    const hash = this.hashToken(rawRefreshToken);

    const session = await prisma.userSession.findUnique({
      where: { refreshTokenHash: hash },
      include: { user: true },
    });

    if (!session || session.isRevoked || new Date() > session.expiresAt) {
      // Possible reuse attack - revoke all sessions for this user if compromised
      if (session && session.isRevoked) {
        console.warn(`[Security Alert] Refresh token reuse attempt for user: ${session.userId}`);
      }
      throw new UnauthorizedError('Session expired or revoked. Please log in again');
    }

    // Invalidate the old refresh token
    await prisma.userSession.update({
      where: { id: session.id },
      data: { isRevoked: true },
    });

    // Create a new session
    return this.createSession(session.userId, session.user.role, ipAddress, userAgent);
  }

  /**
   * Revokes a specific session
   */
  static async revokeSession(rawRefreshToken: string): Promise<void> {
    const hash = this.hashToken(rawRefreshToken);
    await prisma.userSession.updateMany({
      where: { refreshTokenHash: hash },
      data: { isRevoked: true },
    });
  }

  /**
   * Revokes all sessions for a user (logout from all devices)
   */
  static async revokeAllUserSessions(userId: string): Promise<void> {
    await prisma.userSession.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  /**
   * Lists active sessions for a user
   */
  static async listUserSessions(userId: string) {
    return prisma.userSession.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      include: {
        device: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
