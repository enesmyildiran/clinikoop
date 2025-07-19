const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function deploySetup() {
  try {
    console.log('🚀 Vercel Deploy Kurulum Sistemi');
    console.log('================================\n');

    // 1. Veritabanı bağlantısını test et
    console.log('1️⃣ Veritabanı bağlantısı test ediliyor...');
    await prisma.$connect();
    console.log('   ✅ Veritabanı bağlantısı başarılı');

    // 2. Süper Admin kontrol et/oluştur
    console.log('\n2️⃣ Süper Admin kontrol ediliyor...');
    let superAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (!superAdmin) {
      console.log('   Süper admin oluşturuluyor...');
      const password = 'superadmin123';
      const hashedPassword = await bcrypt.hash(password, 12);
      
      superAdmin = await prisma.user.create({
        data: {
          email: 'superadmin@clinikoop.com',
          name: 'Süper Admin',
          role: 'SUPER_ADMIN',
          password: hashedPassword,
        },
      });
      console.log('   ✅ Süper admin oluşturuldu!');
      console.log(`   📧 Email: ${superAdmin.email}`);
      console.log(`   🔑 Şifre: ${password}`);
    } else {
      console.log('   ✅ Süper admin zaten mevcut');
      console.log(`   📧 Email: ${superAdmin.email}`);
    }

    // 3. Test kliniği kontrol et/oluştur
    console.log('\n3️⃣ Test kliniği kontrol ediliyor...');
    let clinic = await prisma.clinic.findFirst({
      where: { subdomain: 'test' }
    });

    if (!clinic) {
      console.log('   Test kliniği oluşturuluyor...');
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
      console.log('   ✅ Test kliniği oluşturuldu!');
      console.log(`   🏥 Ad: ${clinic.name}`);
      console.log(`   🌐 Subdomain: ${clinic.subdomain}`);
    } else {
      console.log('   ✅ Test kliniği zaten mevcut');
      console.log(`   🏥 Ad: ${clinic.name}`);
    }

    // 4. Standart kullanıcıları kontrol et/oluştur
    console.log('\n4️⃣ Standart kullanıcılar kontrol ediliyor...');
    
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

    for (const userData of standardUsers) {
      const existingUser = await prisma.clinicUser.findFirst({
        where: { 
          email: userData.email,
          clinicId: clinic.id
        }
      });

      if (existingUser) {
        console.log(`   ⚠️  ${userData.role}: ${userData.email} (zaten mevcut)`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);
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

      console.log(`   ✅ ${userData.role}: ${user.email} (şifre: ${userData.password})`);
    }

    console.log('\n🎉 Vercel Deploy Kurulumu Tamamlandı!');
    console.log('=====================================');
    console.log('📋 Erişim Bilgileri:');
    console.log('');
    console.log('🔴 Süper Admin:');
    console.log(`   📧 Email: ${superAdmin.email}`);
    console.log(`   🔑 Şifre: superadmin123`);
    console.log('');
    console.log('🔵 Klinik Kullanıcıları:');
    standardUsers.forEach(user => {
      console.log(`   📧 ${user.email} (${user.role}) - Şifre: ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Sadece production ortamında çalıştır
if (process.env.NODE_ENV === 'production') {
  deploySetup();
} else {
  console.log('⚠️  Bu script sadece production ortamında çalıştırılmalıdır.');
  process.exit(0);
} 