const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('🧪 Test verisi oluşturuluyor...');

    // Mevcut klinik ve kullanıcıları al
    const clinics = await prisma.clinic.findMany();
    const users = await prisma.clinicUser.findMany();
    const patients = await prisma.patient.findMany();

    if (clinics.length === 0 || users.length === 0) {
      console.log('❌ Klinik veya kullanıcı bulunamadı. Önce seed çalıştırın.');
      return;
    }

    const defaultClinic = clinics[0];
    const defaultUser = users[0];
    const defaultPatient = patients[0];

    console.log(`📊 Kullanılan: ${defaultClinic.name}, ${defaultUser.name}`);

    // 1. ActivityLog test verileri
    console.log('📝 ActivityLog verileri oluşturuluyor...');
    const activities = [
      {
        action: 'LOGIN',
        description: 'Sisteme giriş yapıldı',
        entityType: 'USER',
        userId: defaultUser.id,
        clinicId: defaultClinic.id
      },
      {
        action: 'CREATE',
        description: 'Yeni hasta kaydı oluşturuldu',
        entityType: 'PATIENT',
        userId: defaultUser.id,
        clinicId: defaultClinic.id
      },
      {
        action: 'UPDATE',
        description: 'Teklif güncellendi',
        entityType: 'OFFER',
        userId: defaultUser.id,
        clinicId: defaultClinic.id
      },
      {
        action: 'CREATE',
        description: 'Yeni randevu oluşturuldu',
        entityType: 'APPOINTMENT',
        userId: defaultUser.id,
        clinicId: defaultClinic.id
      }
    ];

    for (const activity of activities) {
      await prisma.activityLog.create({
        data: {
          ...activity,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Son 7 gün içinde
        }
      });
    }

    // 2. AnalyticsEvent test verileri
    console.log('📊 AnalyticsEvent verileri oluşturuluyor...');
    const events = [
      {
        eventType: 'page_view',
        eventData: JSON.stringify({ page: '/dashboard', duration: 120 }),
        userId: defaultUser.id,
        clinicId: defaultClinic.id
      },
      {
        eventType: 'button_click',
        eventData: JSON.stringify({ button: 'create_patient', location: 'patients_page' }),
        userId: defaultUser.id,
        clinicId: defaultClinic.id
      },
      {
        eventType: 'form_submit',
        eventData: JSON.stringify({ form: 'offer_form', fields: ['title', 'price', 'description'] }),
        userId: defaultUser.id,
        clinicId: defaultClinic.id
      }
    ];

    for (const event of events) {
      await prisma.analyticsEvent.create({
        data: {
          ...event,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
      });
    }

    // 3. Appointment test verileri
    console.log('📅 Appointment verileri oluşturuluyor...');
    const appointments = [
      {
        patientId: defaultPatient.id,
        doctorId: defaultUser.id,
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Yarın
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30 dakika
        appointmentType: 'MUAYENE',
        status: 'ONAYLANDI',
        notes: 'Kontrol randevusu'
      },
      {
        patientId: defaultPatient.id,
        doctorId: defaultUser.id,
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 gün sonra
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 saat
        appointmentType: 'DOLGU',
        status: 'BEKLEMEDE',
        notes: 'Diş dolgusu tedavisi'
      }
    ];

    for (const appointment of appointments) {
      await prisma.appointment.create({
        data: appointment
      });
    }

    // 4. Reminder test verileri
    console.log('📋 Reminder verileri oluşturuluyor...');
    const reminders = [
      {
        title: 'Hasta kontrolü',
        description: 'Mehmet Özkan için kontrol randevusu',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'PENDING',
        priority: 'HIGH',
        userId: defaultUser.id
      },
      {
        title: 'Teklif takibi',
        description: 'Enes Yıldıran teklifini takip et',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
        priority: 'MEDIUM',
        userId: defaultUser.id
      },
      {
        title: 'Stok kontrolü',
        description: 'Diş dolgu malzemelerini kontrol et',
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Dün
        status: 'DONE',
        priority: 'LOW',
        userId: defaultUser.id
      }
    ];

    for (const reminder of reminders) {
      await prisma.reminder.create({
        data: reminder
      });
    }

    console.log('✅ Test verisi başarıyla oluşturuldu!');
    console.log('📊 Oluşturulan veriler:');
    console.log('   - 4 ActivityLog kaydı');
    console.log('   - 3 AnalyticsEvent kaydı');
    console.log('   - 2 Appointment kaydı');
    console.log('   - 3 Reminder kaydı');

  } catch (error) {
    console.error('❌ Test verisi oluşturulurken hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData(); 