const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestAdmin() {
  try {
    console.log('Test admin kullanıcısı oluşturuluyor...');

    // Test kliniği oluştur veya bul
    let clinic = await prisma.clinic.findFirst({
      where: { subdomain: 'test' }
    });

    if (!clinic) {
      clinic = await prisma.clinic.create({
        data: {
          name: 'Test Klinik',
          subdomain: 'test',
          isActive: true,
          maxUsers: 10,
          maxPatients: 1000,
          maxOffers: 5000,
          subscriptionStatus: 'TRIAL'
        }
      });
      console.log('✅ Test kliniği oluşturuldu');
    }

    // Admin kullanıcısı oluştur
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.clinicUser.upsert({
      where: { email: 'admin@test.com' },
      update: {
        password: hashedPassword,
        isActive: true
      },
      create: {
        email: 'admin@test.com',
        name: 'Test Admin',
        password: hashedPassword,
        role: 'ADMIN',
        clinicId: clinic.id,
        isActive: true
      }
    });

    console.log('✅ Test admin kullanıcısı oluşturuldu:');
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   👤 Ad: ${admin.name}`);
    console.log(`   🔑 Şifre: admin123`);
    console.log(`   🏥 Klinik: ${clinic.name}`);

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAdmin(); 