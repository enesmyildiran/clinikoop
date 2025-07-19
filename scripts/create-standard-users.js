const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createStandardUsers() {
  try {
    console.log('Standart klinik kullanıcıları oluşturuluyor...');

    // Test kliniğini bul veya oluştur
    let clinic = await prisma.clinic.findFirst({
      where: { subdomain: 'test' }
    });

    if (!clinic) {
      console.log('Test kliniği bulunamadı, oluşturuluyor...');
      clinic = await prisma.clinic.create({
        data: {
          name: 'Test Klinik',
          subdomain: 'test',
          isActive: true,
          maxUsers: 10,
          maxPatients: 1000,
          maxOffers: 5000,
        },
      });
      console.log('✅ Test kliniği oluşturuldu:', clinic.name);
    }

    // Standart kullanıcıları tanımla
    const standardUsers = [
      {
        email: 'admin@test.com',
        name: 'Klinik Admin',
        role: 'ADMIN',
        password: 'admin123'
      },
      {
        email: 'doctor@test.com',
        name: 'Dr. Ahmet Yılmaz',
        role: 'DOCTOR',
        password: 'doctor123'
      },
      {
        email: 'sales@test.com',
        name: 'Satış Temsilcisi',
        role: 'SALES',
        password: 'sales123'
      },
      {
        email: 'user@test.com',
        name: 'Standart Kullanıcı',
        role: 'USER',
        password: 'user123'
      }
    ];

    // Her kullanıcı için kontrol et ve oluştur
    for (const userData of standardUsers) {
      const existingUser = await prisma.clinicUser.findFirst({
        where: { 
          email: userData.email,
          clinicId: clinic.id
        }
      });

      if (existingUser) {
        console.log(`⚠️  Kullanıcı zaten mevcut: ${userData.email}`);
        continue;
      }

      // Şifreyi hash'le
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Kullanıcıyı oluştur
      const user = await prisma.clinicUser.create({
        data: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          password: hashedPassword,
          clinicId: clinic.id,
          isActive: true,
        },
      });

      console.log(`✅ ${userData.role} kullanıcısı oluşturuldu:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Ad: ${user.name}`);
      console.log(`   🔑 Şifre: ${userData.password}`);
    }

    console.log('\n🎉 Tüm standart kullanıcılar oluşturuldu!');
    console.log('📋 Test bilgileri:');
    console.log(`   🌐 Klinik: ${clinic.name} (${clinic.subdomain})`);
    console.log(`   🔗 URL: http://${clinic.subdomain}.localhost:3000`);
    console.log('\n⚠️  ÖNEMLİ: Canlı ortamda şifreleri mutlaka değiştirin!');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createStandardUsers(); 