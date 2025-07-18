import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clinicId, logTypes, logLevels, dateRange, pageSize = 20, searchTerm = '' } = body;

    // Klinik bilgisini al
    let clinicName = 'Demo Klinik';
    if (clinicId) {
      const clinic = await prisma.clinic.findUnique({
        where: { id: clinicId },
        select: { name: true }
      });
      clinicName = clinic?.name || 'Bilinmeyen Klinik';
    }

    const result: any = {};

    // Aktivite Logları
    if (logTypes.includes('activityLogs')) {
      result.activityLogs = [
        {
          id: '1',
          action: 'LOGIN',
          description: 'Sisteme giriş yapıldı',
          entityType: 'USER',
          createdAt: new Date(),
          userName: 'Admin User',
          clinicName: clinicName
        },
        {
          id: '2',
          action: 'CREATE',
          description: 'Yeni hasta kaydı oluşturuldu: Mehmet Özkan',
          entityType: 'PATIENT',
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          userName: 'Dr. Ahmet Yılmaz',
          clinicName: clinicName
        },
        {
          id: '3',
          action: 'UPDATE',
          description: 'Teklif güncellendi: Fiyat düzenlendi',
          entityType: 'OFFER',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          userName: 'Admin User',
          clinicName: clinicName
        },
        {
          id: '4',
          action: 'DELETE',
          description: 'Hasta kaydı silindi: Ayşe Demir',
          entityType: 'PATIENT',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
          userName: 'Dr. Fatma Kaya',
          clinicName: clinicName
        }
      ];
    }

    // Sistem Logları
    if (logTypes.includes('systemLogs')) {
      result.systemLogs = [
        {
          id: '1',
          level: 'INFO',
          category: 'SYSTEM',
          message: 'Sistem başlatıldı',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8)
        },
        {
          id: '2',
          level: 'INFO',
          category: 'AUTH',
          message: 'Kullanıcı girişi başarılı',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1)
        },
        {
          id: '3',
          level: 'WARNING',
          category: 'DATABASE',
          message: 'Veritabanı bağlantısı yavaş',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3)
        },
        {
          id: '4',
          level: 'ERROR',
          category: 'API',
          message: 'PDF oluşturma hatası',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
        }
      ];
    }

    // Analitik Eventler
    if (logTypes.includes('analyticsEvents')) {
      result.analyticsEvents = [
        {
          id: '1',
          eventType: 'page_view',
          eventName: 'Dashboard Sayfası Görüntülendi',
          eventData: { page: '/dashboard' },
          createdAt: new Date(),
          userName: 'Admin User',
          clinicName: clinicName
        },
        {
          id: '2',
          eventType: 'button_click',
          eventName: 'Hasta Oluştur Butonu Tıklandı',
          eventData: { button: 'create_patient' },
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          userName: 'Dr. Ahmet Yılmaz',
          clinicName: clinicName
        },
        {
          id: '3',
          eventType: 'form_submit',
          eventName: 'Teklif Formu Gönderildi',
          eventData: { form: 'offer_form' },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
          userName: 'Admin User',
          clinicName: clinicName
        },
        {
          id: '4',
          eventType: 'file_download',
          eventName: 'PDF Teklif İndirildi',
          eventData: { file: 'offer_123.pdf' },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          userName: 'Dr. Fatma Kaya',
          clinicName: clinicName
        }
      ];
    }

    // Hata Logları
    if (logTypes.includes('errorLogs')) {
      result.errorLogs = [
        {
          id: '1',
          level: 'ERROR',
          category: 'API',
          message: 'API endpoint bulunamadı: /api/nonexistent',
          stackTrace: 'Error: Cannot GET /api/nonexistent\n    at /app/src/app/api/[...]/route.ts:15:23\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5)
        },
        {
          id: '2',
          level: 'CRITICAL',
          category: 'DATABASE',
          message: 'Veritabanı bağlantısı kesildi',
          stackTrace: 'ConnectionError: Connection to database failed\n    at /app/src/lib/database.ts:45:12\n    at async connect() (/app/src/lib/database.ts:23:8)',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
        },
        {
          id: '3',
          level: 'ERROR',
          category: 'PDF',
          message: 'PDF oluşturma sırasında hata oluştu',
          stackTrace: 'PDFGenerationError: Template not found\n    at /app/src/lib/pdf-generator.ts:67:15\n    at async generatePDF() (/app/src/lib/pdf-generator.ts:34:9)',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3)
        }
      ];
    }

    // Kullanıcı Aktiviteleri
    if (logTypes.includes('userActivities')) {
      result.userActivities = [
        {
          id: '1',
          action: 'LOGIN',
          description: 'Sisteme giriş yapıldı',
          entityType: 'USER',
          createdAt: new Date(),
          userName: 'Admin User',
          userEmail: 'admin@demo.com',
          clinicName: clinicName
        },
        {
          id: '2',
          action: 'CREATE',
          description: 'Yeni hasta kaydı oluşturuldu: Mehmet Özkan',
          entityType: 'PATIENT',
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          userName: 'Dr. Ahmet Yılmaz',
          userEmail: 'ahmet@demo.com',
          clinicName: clinicName
        },
        {
          id: '3',
          action: 'UPDATE',
          description: 'Kullanıcı profil bilgileri güncellendi',
          entityType: 'USER',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
          userName: 'Dr. Fatma Kaya',
          userEmail: 'fatma@demo.com',
          clinicName: clinicName
        },
        {
          id: '4',
          action: 'LOGOUT',
          description: 'Sistemden çıkış yapıldı',
          entityType: 'USER',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          userName: 'Admin User',
          userEmail: 'admin@demo.com',
          clinicName: clinicName
        }
      ];
    }

    // Filtreleme uygula
    if (clinicId) {
      // Klinik filtrelemesi zaten yukarıda yapıldı, sadece o klinik için veriler gösteriliyor
      // Burada ek filtreleme gerekmiyor çünkü tüm veriler seçili klinik için oluşturuldu
    }

    if (logLevels.length > 0) {
      Object.keys(result).forEach(key => {
        if (Array.isArray(result[key])) {
          result[key] = result[key].filter((item: any) => 
            item.level && logLevels.includes(item.level)
          );
        }
      });
    }

    if (searchTerm) {
      Object.keys(result).forEach(key => {
        if (Array.isArray(result[key])) {
          result[key] = result[key].filter((item: any) => 
            JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      });
    }

    // Sayfalama uygula
    Object.keys(result).forEach(key => {
      if (Array.isArray(result[key])) {
        result[key] = result[key].slice(0, pageSize);
      }
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Logs API Error:', error);
    return NextResponse.json(
      { error: 'Loglar getirilirken hata oluştu' },
      { status: 500 }
    );
  }
} 