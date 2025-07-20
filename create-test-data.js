const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestData() {
  console.log('🧪 Test verileri oluşturuluyor...');

  try {
    // Varsayılan kliniği bul
    const clinic = await prisma.clinic.findFirst({
      where: { id: 'default_clinic' }
    });

    if (!clinic) {
      console.log('❌ Varsayılan klinik bulunamadı. Önce seed çalıştırın.');
      return;
    }

    // Test hastası oluştur
    let testPatient = await prisma.patient.findFirst({
      where: { 
        phone: '5551234567',
        clinicId: clinic.id
      }
    });

    if (!testPatient) {
      testPatient = await prisma.patient.create({
        data: {
          name: 'Test Hasta',
          email: 'test@example.com',
          phone: '5551234567',
          country: 'TR',
          clinicId: clinic.id,
          isActive: true
        }
      });
    }

    console.log('✅ Test hastası oluşturuldu:', testPatient.name);

    // Test teklifi oluştur
    const testOffer = await prisma.offer.create({
      data: {
        title: 'Test Teklifi',
        description: 'Test tedavi teklifi',
        totalPrice: 1000,
        currency: 'TRY',
        slug: `test-offer-${Date.now()}`,
        clinicId: clinic.id,
        isActive: true,
        statusId: (await prisma.offerStatus.findFirst({ 
          where: { 
            clinicId: clinic.id,
            isDefault: true 
          }
        })).id
      }
    });

    console.log('✅ Test teklifi oluşturuldu:', testOffer.title);

    // PatientOffer ilişkisini oluştur
    await prisma.patientOffer.create({
      data: {
        patientId: testPatient.id,
        offerId: testOffer.id,
        assigned: true,
        visible: true
      }
    });

    console.log('✅ PatientOffer ilişkisi oluşturuldu');

    // Test hatırlatması oluştur
    const testReminder = await prisma.reminder.create({
      data: {
        title: 'Test Hatırlatması',
        description: 'Bu bir test hatırlatmasıdır',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Yarın
        status: 'PENDING',
        isPrivate: false,
        userId: (await prisma.clinicUser.findFirst({ where: { clinicId: clinic.id } })).id,
        clinicId: clinic.id,
        patientId: testPatient.id
      }
    });

    console.log('✅ Test hatırlatması oluşturuldu:', testReminder.title);

    console.log('🎉 Tüm test verileri başarıyla oluşturuldu!');
    console.log('📊 Test verileri:');
    console.log(`   - Hasta: ${testPatient.name} (ID: ${testPatient.id})`);
    console.log(`   - Teklif: ${testOffer.title} (ID: ${testOffer.id})`);
    console.log(`   - Hatırlatma: ${testReminder.title} (ID: ${testReminder.id})`);

  } catch (error) {
    console.error('❌ Test verileri oluşturulurken hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData(); 