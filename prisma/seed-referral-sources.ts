import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultSources = [
  {
    name: 'google',
    displayName: 'Google Arama',
    description: 'Google arama motoru üzerinden gelen hastalar',
    color: '#4285F4',
    order: 1,
    isActive: true
  },
  {
    name: 'instagram',
    displayName: 'Instagram',
    description: 'Instagram sosyal medya platformundan gelen hastalar',
    color: '#E4405F',
    order: 2,
    isActive: true
  },
  {
    name: 'facebook',
    displayName: 'Facebook',
    description: 'Facebook sosyal medya platformundan gelen hastalar',
    color: '#1877F2',
    order: 3,
    isActive: true
  },
  {
    name: 'whatsapp',
    displayName: 'WhatsApp',
    description: 'WhatsApp mesajlaşma uygulamasından gelen hastalar',
    color: '#25D366',
    order: 4,
    isActive: true
  },
  {
    name: 'referral',
    displayName: 'Hasta Referansı',
    description: 'Mevcut hastaların referansı ile gelen hastalar',
    color: '#10B981',
    order: 5,
    isActive: true
  },
  {
    name: 'social_media',
    displayName: 'Sosyal Medya',
    description: 'Diğer sosyal medya platformlarından gelen hastalar',
    color: '#8B5CF6',
    order: 6,
    isActive: true
  },
  {
    name: 'website',
    displayName: 'Web Sitesi',
    description: 'Klinik web sitesinden gelen hastalar',
    color: '#F59E0B',
    order: 7,
    isActive: true
  },
  {
    name: 'advertisement',
    displayName: 'Reklam',
    description: 'Reklamlar aracılığıyla gelen hastalar',
    color: '#EF4444',
    order: 8,
    isActive: true
  },
  {
    name: 'walk_in',
    displayName: 'Yoldan Geçen',
    description: 'Yoldan geçerken gelen hastalar',
    color: '#6B7280',
    order: 9,
    isActive: true
  },
  {
    name: 'other',
    displayName: 'Diğer',
    description: 'Diğer kaynaklardan gelen hastalar',
    color: '#9CA3AF',
    order: 10,
    isActive: true
  }
]

async function main() {
  console.log('🌱 Varsayılan hasta kaynakları oluşturuluyor...')

  for (const source of defaultSources) {
    try {
      await prisma.referralSource.upsert({
        where: { name: source.name },
        update: source,
        create: source
      })
      console.log(`✅ ${source.displayName} kaynağı oluşturuldu/güncellendi`)
    } catch (error) {
      console.error(`❌ ${source.displayName} kaynağı oluşturulurken hata:`, error)
    }
  }

  console.log('🎉 Varsayılan hasta kaynakları başarıyla oluşturuldu!')
}

main()
  .catch((e) => {
    console.error('❌ Seed işlemi başarısız:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 