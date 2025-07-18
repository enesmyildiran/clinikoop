import { prisma } from './db';

export interface ActivityLogData {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'IMPORT' | 'VIEW' | 'DOWNLOAD';
  entityType: 'PATIENT' | 'OFFER' | 'REMINDER' | 'USER' | 'CLINIC' | 'SETTING' | 'PACKAGE' | 'PDF' | 'REPORT';
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  clinicId?: string;
  userId?: string;
}

export interface SystemLogData {
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  category: 'AUTH' | 'DATABASE' | 'API' | 'SYSTEM' | 'SECURITY' | 'PDF' | 'EMAIL';
  message: string;
  details?: Record<string, any>;
  stackTrace?: string;
}

export interface AnalyticsEventData {
  eventType: 'PAGE_VIEW' | 'BUTTON_CLICK' | 'FORM_SUBMIT' | 'API_CALL' | 'PDF_GENERATE' | 'EXPORT' | 'IMPORT';
  eventName: string;
  properties?: Record<string, any>;
  sessionId?: string;
  clinicId?: string;
  userId?: string;
}

/**
 * Aktivite logu kaydet
 */
export async function logActivity(data: ActivityLogData) {
  try {
    await prisma.activityLog.create({
      data: {
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        description: data.description,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        clinicId: data.clinicId,
        userId: data.userId,
      },
    });
  } catch (error) {
    console.error('Activity log kaydedilemedi:', error);
  }
}

/**
 * Sistem logu kaydet
 */
export async function logSystem(data: SystemLogData) {
  try {
    await prisma.systemLog.create({
      data: {
        level: data.level,
        category: data.category,
        message: data.message,
        details: data.details ? JSON.stringify(data.details) : null,
        stackTrace: data.stackTrace,
      },
    });
  } catch (error) {
    console.error('System log kaydedilemedi:', error);
  }
}

/**
 * Analitik event kaydet
 */
export async function logAnalytics(data: AnalyticsEventData) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType: data.eventType,
        eventName: data.eventName,
        properties: data.properties ? JSON.stringify(data.properties) : null,
        sessionId: data.sessionId,
        clinicId: data.clinicId,
        userId: data.userId,
      },
    });
  } catch (error) {
    console.error('Analytics event kaydedilemedi:', error);
  }
}

/**
 * Hızlı log fonksiyonları
 */
export const quickLog = {
  // Kullanıcı işlemleri
  userLogin: (userId: string, clinicId: string, ipAddress?: string) =>
    logActivity({
      action: 'LOGIN',
      entityType: 'USER',
      entityId: userId,
      description: 'Kullanıcı giriş yaptı',
      clinicId,
      ipAddress,
    }),

  userLogout: (userId: string, clinicId: string) =>
    logActivity({
      action: 'LOGOUT',
      entityType: 'USER',
      entityId: userId,
      description: 'Kullanıcı çıkış yaptı',
      clinicId,
      userId,
    }),

  // Hasta işlemleri
  patientCreated: (patientId: string, clinicId: string, userId: string) =>
    logActivity({
      action: 'CREATE',
      entityType: 'PATIENT',
      entityId: patientId,
      description: 'Yeni hasta oluşturuldu',
      clinicId,
      userId,
    }),

  patientUpdated: (patientId: string, clinicId: string, userId: string) =>
    logActivity({
      action: 'UPDATE',
      entityType: 'PATIENT',
      entityId: patientId,
      description: 'Hasta bilgileri güncellendi',
      clinicId,
      userId,
    }),

  // Teklif işlemleri
  offerCreated: (offerId: string, clinicId: string, userId: string) =>
    logActivity({
      action: 'CREATE',
      entityType: 'OFFER',
      entityId: offerId,
      description: 'Yeni teklif oluşturuldu',
      clinicId,
      userId,
    }),

  offerUpdated: (offerId: string, clinicId: string, userId: string) =>
    logActivity({
      action: 'UPDATE',
      entityType: 'OFFER',
      entityId: offerId,
      description: 'Teklif güncellendi',
      clinicId,
      userId,
    }),

  // PDF işlemleri
  pdfGenerated: (offerId: string, clinicId: string, userId: string) =>
    logActivity({
      action: 'EXPORT',
      entityType: 'PDF',
      entityId: offerId,
      description: 'PDF teklifi oluşturuldu',
      clinicId,
      userId,
    }),

  // Sistem işlemleri
  systemError: (message: string, details?: Record<string, any>, stackTrace?: string) =>
    logSystem({
      level: 'ERROR',
      category: 'SYSTEM',
      message,
      details,
      stackTrace,
    }),

  // Analitik
  pageView: (pageName: string, clinicId?: string, userId?: string) =>
    logAnalytics({
      eventType: 'PAGE_VIEW',
      eventName: pageName,
      clinicId,
      userId,
    }),

  buttonClick: (buttonName: string, clinicId?: string, userId?: string) =>
    logAnalytics({
      eventType: 'BUTTON_CLICK',
      eventName: buttonName,
      clinicId,
      userId,
    }),
}; 