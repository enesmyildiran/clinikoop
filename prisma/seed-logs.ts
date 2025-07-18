import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Örnek log verileri ekleniyor...');

  // Örnek klinik ve kullanıcı oluştur (eğer yoksa)
  const clinic = await prisma.clinic.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Demo Klinik',
      subdomain: 'demo',
      isActive: true,
    },
  });

  // Önce kullanıcı var mı kontrol et
  let user = await prisma.clinicUser.findFirst({
    where: { 
      email: 'demo@klinik.com',
      clinicId: clinic.id 
    }
  });

  if (!user) {
    user = await prisma.clinicUser.create({
      data: {
        email: 'demo@klinik.com',
        name: 'Demo Kullanıcı',
        role: 'CLINIC_ADMIN',
        password: 'hashedpassword',
        clinicId: clinic.id,
      },
    });
  }

  // Örnek aktivite logları
  const activityLogs = [
    {
      action: 'LOGIN' as const,
      entityType: 'USER' as const,
      entityId: user.id,
      description: 'Kullanıcı giriş yaptı',
      clinicId: clinic.id,
      userId: user.id,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    {
      action: 'CREATE' as const,
      entityType: 'PATIENT' as const,
      description: 'Yeni hasta oluşturuldu: Ahmet Yılmaz',
      clinicId: clinic.id,
      userId: user.id,
      ipAddress: '192.168.1.100',
    },
    {
      action: 'CREATE' as const,
      entityType: 'OFFER' as const,
      description: 'Yeni teklif oluşturuldu: Diş Dolgusu',
      clinicId: clinic.id,
      userId: user.id,
      ipAddress: '192.168.1.100',
    },
    {
      action: 'UPDATE' as const,
      entityType: 'PATIENT' as const,
      description: 'Hasta bilgileri güncellendi: Ahmet Yılmaz',
      clinicId: clinic.id,
      userId: user.id,
      ipAddress: '192.168.1.100',
    },
    {
      action: 'EXPORT' as const,
      entityType: 'PDF' as const,
      description: 'PDF teklifi oluşturuldu',
      clinicId: clinic.id,
      userId: user.id,
      ipAddress: '192.168.1.100',
    },
    {
      action: 'CREATE' as const,
      entityType: 'REMINDER' as const,
      description: 'Yeni hatırlatma oluşturuldu: Kontrol randevusu',
      clinicId: clinic.id,
      userId: user.id,
      ipAddress: '192.168.1.100',
    },
    {
      action: 'UPDATE' as const,
      entityType: 'OFFER' as const,
      description: 'Teklif durumu güncellendi: Onaylandı',
      clinicId: clinic.id,
      userId: user.id,
      ipAddress: '192.168.1.100',
    },
    {
      action: 'VIEW' as const,
      entityType: 'REPORT' as const,
      description: 'Performans raporu görüntülendi',
      clinicId: clinic.id,
      userId: user.id,
      ipAddress: '192.168.1.100',
    },
  ];

  // Örnek sistem logları
  const systemLogs = [
    {
      level: 'INFO' as const,
      category: 'SYSTEM' as const,
      message: 'Sistem başlatıldı',
    },
    {
      level: 'INFO' as const,
      category: 'AUTH' as const,
      message: 'Kullanıcı başarıyla giriş yaptı',
    },
    {
      level: 'WARNING' as const,
      category: 'API' as const,
      message: 'API rate limit yaklaşıyor',
    },
    {
      level: 'ERROR' as const,
      category: 'DATABASE' as const,
      message: 'Veritabanı bağlantı hatası',
      details: { error: 'Connection timeout' },
    },
    {
      level: 'INFO' as const,
      category: 'PDF' as const,
      message: 'PDF başarıyla oluşturuldu',
    },
    {
      level: 'INFO' as const,
      category: 'EMAIL' as const,
      message: 'Hatırlatma e-postası gönderildi',
    },
  ];

  // Örnek analitik eventleri
  const analyticsEvents = [
    {
      eventType: 'PAGE_VIEW' as const,
      eventName: 'Dashboard',
      clinicId: clinic.id,
      userId: user.id,
    },
    {
      eventType: 'BUTTON_CLICK' as const,
      eventName: 'Create Patient',
      clinicId: clinic.id,
      userId: user.id,
    },
    {
      eventType: 'FORM_SUBMIT' as const,
      eventName: 'Patient Form',
      clinicId: clinic.id,
      userId: user.id,
    },
    {
      eventType: 'PDF_GENERATE' as const,
      eventName: 'Offer PDF',
      clinicId: clinic.id,
      userId: user.id,
    },
    {
      eventType: 'API_CALL' as const,
      eventName: 'Get Patients',
      clinicId: clinic.id,
      userId: user.id,
    },
  ];

  // Logları veritabanına ekle
  for (const log of activityLogs) {
    await prisma.activityLog.create({
      data: {
        ...log,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Son 7 gün içinde
      },
    });
  }

  for (const log of systemLogs) {
    await prisma.systemLog.create({
      data: {
        ...log,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Son 7 gün içinde
      },
    });
  }

  for (const event of analyticsEvents) {
    await prisma.analyticsEvent.create({
      data: {
        ...event,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Son 7 gün içinde
      },
    });
  }

  console.log('✅ Örnek log verileri başarıyla eklendi!');
  console.log(`📊 ${activityLogs.length} aktivite logu`);
  console.log(`🔧 ${systemLogs.length} sistem logu`);
  console.log(`📈 ${analyticsEvents.length} analitik event`);
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 