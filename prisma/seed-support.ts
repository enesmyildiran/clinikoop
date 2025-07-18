import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Destek sistemi seed verileri oluşturuluyor...')

  // Destek kategorileri
  const categories = await Promise.all([
    prisma.supportCategory.upsert({
      where: { name: 'Teknik Destek' },
      update: {},
      create: {
        name: 'Teknik Destek',
        description: 'Sistem ve teknik sorunlar',
        color: '#f59e42',
        order: 1
      }
    }),
    prisma.supportCategory.upsert({
      where: { name: 'Faturalama' },
      update: {},
      create: {
        name: 'Faturalama',
        description: 'Fatura ve ödeme sorunları',
        color: '#10b981',
        order: 2
      }
    }),
    prisma.supportCategory.upsert({
      where: { name: 'Özellik İsteği' },
      update: {},
      create: {
        name: 'Özellik İsteği',
        description: 'Yeni özellik talepleri',
        color: '#8b5cf6',
        order: 3
      }
    }),
    prisma.supportCategory.upsert({
      where: { name: 'Genel Soru' },
      update: {},
      create: {
        name: 'Genel Soru',
        description: 'Genel sorular ve bilgi talepleri',
        color: '#6b7280',
        order: 4
      }
    })
  ])

  // Destek öncelikleri
  const priorities = await Promise.all([
    prisma.supportPriority.upsert({
      where: { name: 'Düşük' },
      update: {},
      create: {
        name: 'Düşük',
        level: 1,
        color: '#10b981',
        slaHours: 72
      }
    }),
    prisma.supportPriority.upsert({
      where: { name: 'Orta' },
      update: {},
      create: {
        name: 'Orta',
        level: 2,
        color: '#f59e42',
        slaHours: 48
      }
    }),
    prisma.supportPriority.upsert({
      where: { name: 'Yüksek' },
      update: {},
      create: {
        name: 'Yüksek',
        level: 3,
        color: '#ef4444',
        slaHours: 24
      }
    }),
    prisma.supportPriority.upsert({
      where: { name: 'Kritik' },
      update: {},
      create: {
        name: 'Kritik',
        level: 4,
        color: '#dc2626',
        slaHours: 4
      }
    })
  ])

  // Destek durumları
  const statuses = await Promise.all([
    prisma.supportStatus.upsert({
      where: { name: 'Açık' },
      update: {},
      create: {
        name: 'Açık',
        color: '#2563eb',
        order: 1
      }
    }),
    prisma.supportStatus.upsert({
      where: { name: 'İnceleniyor' },
      update: {},
      create: {
        name: 'İnceleniyor',
        color: '#f59e42',
        order: 2
      }
    }),
    prisma.supportStatus.upsert({
      where: { name: 'Yanıtlandı' },
      update: {},
      create: {
        name: 'Yanıtlandı',
        color: '#10b981',
        order: 3
      }
    }),
    prisma.supportStatus.upsert({
      where: { name: 'Kapalı' },
      update: {},
      create: {
        name: 'Kapalı',
        color: '#6b7280',
        order: 4
      }
    })
  ])

  // Örnek klinik ve kullanıcı oluştur (eğer yoksa)
  const clinic = await prisma.clinic.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Demo Klinik',
      subdomain: 'demo',
      maxUsers: 10,
      maxPatients: 200,
      maxOffers: 1000
    }
  })

  // Kullanıcıyı kontrol et veya oluştur
  let user = await prisma.clinicUser.findFirst({
    where: { 
      email: 'demo@clinikoop.com',
      clinicId: clinic.id
    }
  })

  if (!user) {
    user = await prisma.clinicUser.create({
      data: {
        email: 'demo@clinikoop.com',
        name: 'Demo Kullanıcı',
        password: 'hashed_password_here',
        clinicId: clinic.id,
        role: 'USER'
      }
    })
  }

  // Örnek destek talebi oluştur
  const ticket = await prisma.supportTicket.create({
    data: {
      ticketNumber: 'TKT-2025-001',
      subject: 'PDF çıktısı alamıyorum',
      description: 'Teklif oluşturduktan sonra PDF indirme butonuna tıkladığımda hata alıyorum. Hata mesajı: "PDF oluşturulamadı".',
      isUrgent: false,
      clinicId: clinic.id,
      createdById: user.id,
      categoryId: categories[0].id, // Teknik Destek
      priorityId: priorities[2].id, // Yüksek
      statusId: statuses[0].id // Açık
    }
  })

  // Örnek mesajlar
  await prisma.supportMessage.createMany({
    data: [
      {
        ticketId: ticket.id,
        authorId: user.id,
        authorName: user.name,
        authorType: 'CLINIC_USER',
        content: 'PDF çıktısı alamıyorum, hata veriyor.'
      },
      {
        ticketId: ticket.id,
        authorId: 'admin',
        authorName: 'Destek Ekibi',
        authorType: 'ADMIN',
        content: 'Merhaba, hatayı detaylandırabilir misiniz? Hangi tarayıcıyı kullanıyorsunuz?'
      }
    ]
  })

  console.log('✅ Destek sistemi seed verileri oluşturuldu!')
  console.log(`📋 Kategoriler: ${categories.length}`)
  console.log(`⚡ Öncelikler: ${priorities.length}`)
  console.log(`📊 Durumlar: ${statuses.length}`)
  console.log(`🎫 Örnek talep: ${ticket.ticketNumber}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 