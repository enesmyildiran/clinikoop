const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Varsayılan bilgiler
defaults = {
  clinicId: '1', // Gerekirse burayı güncelle
  email: 'test@clinikoop.com',
  name: 'testuser',
  role: 'USER',
  password: 'Test1234!'
};

async function main() {
  try {
    // Klinik var mı kontrol et
    const clinic = await prisma.clinic.findFirst({
      where: { id: defaults.clinicId }
    });
    if (!clinic) {
      console.error('❌ Klinik bulunamadı! Lütfen doğru clinicId girin.');
      process.exit(1);
    }

    // Kullanıcı zaten var mı?
    const existingUser = await prisma.clinicUser.findFirst({
      where: { email: defaults.email, clinicId: defaults.clinicId }
    });
    if (existingUser) {
      console.log('⚠️  Kullanıcı zaten mevcut:');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Ad: ${existingUser.name}`);
      return;
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(defaults.password, 12);

    // Kullanıcıyı oluştur
    const user = await prisma.clinicUser.create({
      data: {
        email: defaults.email,
        name: defaults.name,
        role: defaults.role,
        password: hashedPassword,
        clinicId: defaults.clinicId,
        isActive: true
      }
    });

    console.log('✅ Klinik kullanıcısı başarıyla oluşturuldu!');
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👤 Ad: ${user.name}`);
    console.log(`   🔑 Şifre: ${defaults.password}`);
    console.log(`   🏥 Klinik ID: ${defaults.clinicId}`);
    console.log(`   Rol: ${user.role}`);
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 