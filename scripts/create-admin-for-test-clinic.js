const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminForTestClinic() {
  try {
    console.log('Test kliniği ve admin kullanıcısı oluşturuluyor...');

    // Mevcut test kliniğini bul veya oluştur
    let testClinic = await prisma.clinic.findFirst({
      where: { subdomain: 'test' }
    });

    if (!testClinic) {
      testClinic = await prisma.clinic.create({
        data: {
          name: 'Test Klinik',
          subdomain: 'test',
          isActive: true,
          maxUsers: 10,
          maxPatients: 1000,
          maxOffers: 5000,
          subscriptionStatus: 'ACTIVE'
        }
      });
      console.log('✅ Test kliniği oluşturuldu:', testClinic.name);
    } else {
      console.log('✅ Mevcut test kliniği bulundu:', testClinic.name);
    }

    // Admin kullanıcısı var mı kontrol et
    let adminUser = await prisma.clinicUser.findFirst({
      where: { email: 'admin@test.com', clinicId: testClinic.id }
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      adminUser = await prisma.clinicUser.create({
        data: {
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'ADMIN',
          password: hashedPassword,
          isActive: true,
          clinicId: testClinic.id
        }
      });
      console.log('✅ Admin kullanıcısı oluşturuldu:');
      console.log('   Email:', adminUser.email);
      console.log('   Şifre: admin123');
    } else {
      console.log('✅ Mevcut admin kullanıcısı bulundu:', adminUser.email);
    }

    // Süper admin var mı kontrol et
    let superAdmin = await prisma.user.findFirst({
      where: { email: 'superadmin@clinikoop.com' }
    });

    if (!superAdmin) {
      const superAdminPassword = await bcrypt.hash('superadmin123', 12);
      superAdmin = await prisma.user.create({
        data: {
          email: 'superadmin@clinikoop.com',
          name: 'Süper Admin',
          role: 'SUPER_ADMIN',
          password: superAdminPassword
        }
      });
      console.log('✅ Süper admin oluşturuldu:');
      console.log('   Email:', superAdmin.email);
      console.log('   Şifre: superadmin123');
    } else {
      console.log('✅ Mevcut süper admin bulundu:', superAdmin.email);
    }

    // Test kategorileri oluştur
    const categories = [
      { name: 'Teknik Sorun', displayName: 'Teknik Sorun', description: 'Sistem ve teknik sorunlar' },
      { name: 'Kullanım', displayName: 'Kullanım', description: 'Kullanım ile ilgili sorular' },
      { name: 'Özellik Talebi', displayName: 'Özellik Talebi', description: 'Yeni özellik istekleri' }
    ];

    for (const category of categories) {
      const existingCategory = await prisma.supportCategory.findFirst({
        where: { name: category.name }
      });
      
      if (!existingCategory) {
        await prisma.supportCategory.create({
          data: category
        });
        console.log(`✅ Kategori oluşturuldu: ${category.name}`);
      } else {
        console.log(`✅ Kategori zaten mevcut: ${category.name}`);
      }
    }

    // Test öncelikleri oluştur
    const priorities = [
      { name: 'Düşük', displayName: 'Düşük', level: 1, color: '#10B981' },
      { name: 'Normal', displayName: 'Normal', level: 2, color: '#3B82F6' },
      { name: 'Yüksek', displayName: 'Yüksek', level: 3, color: '#F59E0B' },
      { name: 'Acil', displayName: 'Acil', level: 4, color: '#EF4444' },
      { name: 'Kritik', displayName: 'Kritik', level: 5, color: '#7C3AED' }
    ];

    for (const priority of priorities) {
      const existingPriority = await prisma.supportPriority.findFirst({
        where: { name: priority.name }
      });
      
      if (!existingPriority) {
        await prisma.supportPriority.create({
          data: priority
        });
        console.log(`✅ Öncelik oluşturuldu: ${priority.name}`);
      } else {
        console.log(`✅ Öncelik zaten mevcut: ${priority.name}`);
      }
    }

    // Support Status'ları oluştur
    console.log('Support Status\'ları oluşturuluyor...');
    
    const statuses = [
      { name: 'Açık', displayName: 'Açık', color: '#3B82F6', order: 1 },
      { name: 'İşlemde', displayName: 'İşlemde', color: '#F59E0B', order: 2 },
      { name: 'Beklemede', displayName: 'Beklemede', color: '#6B7280', order: 3 },
      { name: 'Çözüldü', displayName: 'Çözüldü', color: '#10B981', order: 4 },
      { name: 'Kapalı', displayName: 'Kapalı', color: '#EF4444', order: 5 }
    ];

    for (const status of statuses) {
      const existingStatus = await prisma.supportStatus.findFirst({
        where: { name: status.name }
      });

      if (!existingStatus) {
        await prisma.supportStatus.create({
          data: status
        });
        console.log(`✅ Yeni status oluşturuldu: ${status.name}`);
      } else {
        console.log(`✅ Status zaten mevcut: ${status.name}`);
      }
    }

    console.log('\n🎉 Tüm test verileri başarıyla oluşturuldu!');
    console.log('\n📋 Giriş Bilgileri:');
    console.log('   Klinik Admin: admin@test.com / admin123');
    console.log('   Süper Admin: superadmin@clinikoop.com / superadmin123');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminForTestClinic(); 