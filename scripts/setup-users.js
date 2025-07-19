const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupUsers() {
  try {
    console.log('🚀 Clinikoop Kullanıcı Kurulum Sistemi');
    console.log('=====================================\n');

    // 1. Süper Admin Oluştur
    console.log('1️⃣ Süper Admin kontrol ediliyor...');
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

    // 2. Test Kliniği Oluştur
    console.log('\n2️⃣ Test kliniği kontrol ediliyor...');
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

    // 3. Standart Kullanıcıları Oluştur
    console.log('\n3️⃣ Standart kullanıcılar oluşturuluyor...');
    
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

    let createdCount = 0;
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
      createdCount++;
    }

    // 4. Özet
    console.log('\n🎉 Kurulum Tamamlandı!');
    console.log('=====================');
    console.log('📋 Erişim Bilgileri:');
    console.log('');
    console.log('🔴 Süper Admin (Tüm sistemlere erişim):');
    console.log(`   📧 Email: ${superAdmin.email}`);
    console.log(`   🔑 Şifre: superadmin123`);
    console.log(`   🔗 URL: http://localhost:3000/admin`);
    console.log('');
    console.log('🔵 Klinik Kullanıcıları (Test kliniği):');
    console.log(`   🌐 Klinik: ${clinic.name}`);
    console.log(`   🔗 URL: http://${clinic.subdomain}.localhost:3000`);
    console.log('');
    
    standardUsers.forEach(user => {
      console.log(`   📧 ${user.email} (${user.role}) - Şifre: ${user.password}`);
    });

    console.log('\n⚠️  ÖNEMLİ NOTLAR:');
    console.log('   • Canlı ortamda tüm şifreleri değiştirin!');
    console.log('   • Geliştirme modunda localhost otomatik süper admin yetkisi verir');
    console.log('   • Canlıda gerçek NextAuth sistemi devreye girer');
    console.log('   • Test kullanıcıları sadece geliştirme için kullanın');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupUsers(); 