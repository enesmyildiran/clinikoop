const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestClinic() {
  try {
    console.log('Test kliniği oluşturuluyor...');

    // Test kliniği oluştur
    const clinic = await prisma.clinic.create({
      data: {
        name: 'Test Klinik',
        subdomain: 'test',
        isActive: true,
        maxUsers: 10,
        maxPatients: 1000,
        maxOffers: 5000,
      },
    });

    console.log('Klinik oluşturuldu:', clinic);

    // Test kullanıcısı oluştur
    const user = await prisma.clinicUser.create({
      data: {
        email: 'test@clinikoop.com',
        name: 'Test Kullanıcı',
        role: 'ADMIN',
        password: '$2a$10$hashedpassword', // Gerçek uygulamada hash'lenmiş olmalı
        clinicId: clinic.id,
      },
    });

    console.log('Kullanıcı oluşturuldu:', user);

    // Test ayarları oluştur
    const settings = [
      { key: 'general.clinicName', value: 'Test Klinik' },
      { key: 'general.clinicEmail', value: 'test@clinikoop.com' },
      { key: 'general.clinicPhone', value: '+90 212 123 4567' },
      { key: 'general.clinicAddress', value: 'Test Adres, İstanbul' },
      { key: 'currency.defaultCurrency', value: 'TRY' },
      { key: 'currency.taxRate', value: '20' },
      { key: 'pdf.clinicName', value: 'Test Klinik' },
      { key: 'pdf.clinicSlogan', value: 'Test Slogan' },
    ];

    for (const setting of settings) {
      await prisma.clinicSetting.create({
        data: {
          key: setting.key,
          value: setting.value,
          clinicId: clinic.id,
        },
      });
    }

    console.log('Ayarlar oluşturuldu');

    // Test hastası oluştur
    const patient = await prisma.patient.create({
      data: {
        name: 'Test Hasta',
        email: 'hasta@test.com',
        phone: '+90 532 123 4567',
        clinicId: clinic.id,
      },
    });

    console.log('Hasta oluşturuldu:', patient);

    console.log('✅ Test kliniği başarıyla oluşturuldu!');
    console.log('Subdomain:', clinic.subdomain);
    console.log('URL:', `http://${clinic.subdomain}.localhost:3000`);

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestClinic(); 