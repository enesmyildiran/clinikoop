import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clinicId, logTypes, logLevels, dateRange, pageSize = 20, searchTerm = '' } = body;

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
          clinicName: 'Demo Klinik'
        },
        {
          id: '2',
          action: 'CREATE',
          description: 'Yeni hasta kaydı oluşturuldu: Mehmet Özkan',
          entityType: 'PATIENT',
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          userName: 'Dr. Ahmet Yılmaz',
          clinicName: 'Demo Klinik'
        },
        {
          id: '3',
          action: 'UPDATE',
          description: 'Teklif güncellendi: Fiyat düzenlendi',
          entityType: 'OFFER',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          userName: 'Admin User',
          clinicName: 'Demo Klinik'
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
        }
      ];
    }

    // Analitik Eventler
    if (logTypes.includes('analyticsEvents')) {
      result.analyticsEvents = [
        {
          id: '1',
          eventType: 'page_view',
          eventData: { page: '/dashboard' },
          createdAt: new Date(),
          userName: 'Admin User',
          clinicName: 'Demo Klinik'
        },
        {
          id: '2',
          eventType: 'button_click',
          eventData: { button: 'create_patient' },
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          userName: 'Dr. Ahmet Yılmaz',
          clinicName: 'Demo Klinik'
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
          message: 'API endpoint bulunamadı',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5)
        },
        {
          id: '2',
          level: 'CRITICAL',
          category: 'DATABASE',
          message: 'Veritabanı bağlantısı kesildi',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
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
          clinicName: 'Demo Klinik'
        },
        {
          id: '2',
          action: 'CREATE',
          description: 'Yeni hasta kaydı oluşturuldu',
          entityType: 'PATIENT',
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          userName: 'Dr. Ahmet Yılmaz',
          userEmail: 'ahmet@demo.com',
          clinicName: 'Demo Klinik'
        }
      ];
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Logs API Error:', error);
    return NextResponse.json(
      { error: 'Loglar getirilirken hata oluştu' },
      { status: 500 }
    );
  }
} 