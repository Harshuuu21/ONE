import { prisma } from '../../../config/database.js';

interface LogAuthEventParams {
  userId?: string | null;
  mobileNumber?: string;
  event: string;
  status: 'SUCCESS' | 'FAILURE';
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export class AuditService {
  static async logEvent(params: LogAuthEventParams) {
    try {
      await prisma.authenticationAuditLog.create({
        data: {
          userId: params.userId || null,
          mobileNumber: params.mobileNumber || null,
          event: params.event,
          status: params.status,
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
          metadata: params.metadata || {},
        },
      });
    } catch (err) {
      console.error('[AuditService] Failed to record auth audit log:', err);
    }
  }
}
