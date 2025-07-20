import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Varsayılan kliniği oluştur
  const defaultClinic = await prisma.clinic.upsert({
    where: { id: 'default_clinic' },
    update: {},
    create: {
      id: 'default_clinic',
      name: 'Varsayılan Klinik',
      subdomain: 'default',
      isActive: true,
      maxUsers: 10,
      maxPatients: 1000,
      maxOffers: 5000,
      subscriptionStatus: 'TRIAL'
    }
  });

  // Varsayılan kullanıcıyı oluştur
  const existingUser = await prisma.clinicUser.findFirst({
    where: { email: 'admin@clinikoop.com' }
  });

  if (!existingUser) {
    await prisma.clinicUser.create({
      data: {
        email: 'admin@clinikoop.com',
        name: 'Admin User',
        password: '$2a$10$hashedpassword', // bcrypt ile hashlenmiş dummy şifre
        role: 'ADMIN',
        clinicId: defaultClinic.id,
        isActive: true
      }
    });
  }

  // Support kategorileri
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
    }
  }

  // Support öncelikleri
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
    }
  }

  // Support durumları
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
    }
  }

  // Teklif durumları
  const offerStatuses = [
    { name: 'DRAFT', displayName: 'Taslak', color: '#6B7280', order: 1, isDefault: true, clinicId: defaultClinic.id },
    { name: 'SENT', displayName: 'Gönderildi', color: '#3B82F6', order: 2, isDefault: false, clinicId: defaultClinic.id },
    { name: 'VIEWED', displayName: 'Görüntülendi', color: '#10B981', order: 3, isDefault: false, clinicId: defaultClinic.id },
    { name: 'ACCEPTED', displayName: 'Kabul Edildi', color: '#059669', order: 4, isDefault: false, clinicId: defaultClinic.id },
    { name: 'REJECTED', displayName: 'Reddedildi', color: '#EF4444', order: 5, isDefault: false, clinicId: defaultClinic.id }
  ];

  for (const offerStatus of offerStatuses) {
    const existingOfferStatus = await prisma.offerStatus.findFirst({
      where: { 
        name: offerStatus.name,
        clinicId: defaultClinic.id
      }
    });

    if (!existingOfferStatus) {
      await prisma.offerStatus.create({
        data: offerStatus
      });
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 