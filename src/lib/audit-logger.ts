import { prisma } from './db';

export interface AuditLogData {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  clinicId?: string;
}

export class AuditLogger {
  static async log(data: AuditLogData) {
    try {
      await prisma.activityLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          details: data.details ? JSON.stringify(data.details) : null,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          clinicId: data.clinicId,
        }
      });
    } catch (error) {
      console.error('Audit log error:', error);
      // Audit log hatası uygulamayı durdurmamalı
    }
  }

  // Login audit log
  static async logLogin(userId: string, success: boolean, ipAddress?: string, userAgent?: string) {
    await this.log({
      userId,
      action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      resource: 'AUTH',
      details: { success, timestamp: new Date().toISOString() },
      ipAddress,
      userAgent,
    });
  }

  // Logout audit log
  static async logLogout(userId: string, ipAddress?: string) {
    await this.log({
      userId,
      action: 'LOGOUT',
      resource: 'AUTH',
      details: { timestamp: new Date().toISOString() },
      ipAddress,
    });
  }

  // User management audit log
  static async logUserAction(userId: string, action: string, targetUserId: string, details?: any) {
    await this.log({
      userId,
      action,
      resource: 'USER',
      resourceId: targetUserId,
      details,
    });
  }

  // Clinic management audit log
  static async logClinicAction(userId: string, action: string, clinicId: string, details?: any) {
    await this.log({
      userId,
      action,
      resource: 'CLINIC',
      resourceId: clinicId,
      details,
      clinicId,
    });
  }

  // Data access audit log
  static async logDataAccess(userId: string, resource: string, resourceId: string, clinicId?: string) {
    await this.log({
      userId,
      action: 'DATA_ACCESS',
      resource,
      resourceId,
      clinicId,
    });
  }

  // Error audit log
  static async logError(userId: string, error: string, context?: any) {
    await this.log({
      userId,
      action: 'ERROR',
      resource: 'SYSTEM',
      details: { error, context, timestamp: new Date().toISOString() },
    });
  }
} 