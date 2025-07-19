const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('Süper admin kullanıcısı oluşturuluyor...');

    // Mevcut süper admin var mı kontrol et
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (existingAdmin) {
      console.log('⚠️  Zaten bir süper admin kullanıcısı mevcut:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Ad: ${existingAdmin.name}`);
      console.log(`   Rol: ${existingAdmin.role}`);
      return;
    }

    // Şifreyi hash'le
    const password = 'superadmin123'; // Geçici şifre - canlıda değiştirilmeli
    const hashedPassword = await bcrypt.hash(password, 12);

    // Süper admin oluştur
    const superAdmin = await prisma.user.create({
      data: {
        email: 'superadmin@clinikoop.com',
        name: 'Süper Admin',
        role: 'SUPER_ADMIN',
        password: hashedPassword,
      },
    });

    console.log('✅ Süper admin başarıyla oluşturuldu!');
    console.log('📧 Email:', superAdmin.email);
    console.log('👤 Ad:', superAdmin.name);
    console.log('🔑 Şifre:', password);
    console.log('⚠️  ÖNEMLİ: Canlı ortamda şifreyi mutlaka değiştirin!');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin(); 