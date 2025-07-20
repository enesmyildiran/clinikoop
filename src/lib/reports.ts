import { ReportFilters, ReportResponse } from '@/types/report'
import { prisma } from '@/lib/db'

// Gerçek veritabanından veri çek
export async function getReports(filters: ReportFilters, clinicId?: string): Promise<ReportResponse> {
  const { dateFrom, dateTo, currency, salesUserId, treatmentType, referralSourceId, page, pageSize } = filters

  // Tarih filtresi oluştur
  const whereClause: any = {
    isDeleted: false
  }

  // Clinic filtresi ekle
  if (clinicId) {
    whereClause.clinicId = clinicId
  }

  if (dateFrom || dateTo) {
    whereClause.createdAt = {}
    if (dateFrom) whereClause.createdAt.gte = new Date(dateFrom)
    if (dateTo) whereClause.createdAt.lte = new Date(dateTo)
  }

  if (salesUserId) {
    whereClause.createdById = salesUserId
  }

  // Teklifleri veritabanından çek
  const offers = await prisma.offer.findMany({
    where: whereClause,
    include: {
      patientOffers: {
        include: {
          patient: true
        }
      },
      createdBy: true,
      status: true,
      treatments: true
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize
  })

  console.log('🔍 getReports - Bulunan teklif sayısı:', offers.length)
  console.log('🔍 getReports - İlk teklif:', offers[0] ? {
    id: offers[0].id,
    title: offers[0].title,
    status: offers[0].status,
    createdAt: offers[0].createdAt
  } : 'Teklif yok')

  // Toplam sayıyı al
  const totalCount = await prisma.offer.count({
    where: whereClause
  })

  console.log('🔍 getReports - Toplam teklif sayısı (count):', totalCount)

  // Teklifleri dönüştür
  const transformedOffers = offers.map((offer: any) => {
    // Doğru toplam tutarı kullan - offer.totalPrice
    const totalAmount = offer.totalPrice || 0

    // Tedavi türlerini birleştir
    const treatmentTypes = offer.treatments
      .map((t: any) => t.name || 'Bilinmeyen')
      .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index) // Tekrarları kaldır
      .join(', ')

    return {
      id: offer.id,
      patientName: offer.patientOffers[0]?.patient?.name || 'Bilinmeyen Hasta',
      patient: {
        referralSourceId: offer.patientOffers[0]?.patient?.referralSourceId
      },
      treatmentType: treatmentTypes || 'Belirtilmemiş',
      amount: totalAmount,
      currency: offer.currency || 'TRY',
      status: offer.status?.name || 'Taslak',
      statusDisplay: offer.status?.displayName || 'Taslak',
      createdAt: offer.createdAt.toISOString(),
      salesUser: {
        name: offer.createdBy?.name || 'Bilinmeyen Kullanıcı'
      }
    }
  })

  // Filtreleme (tedavi türü için)
  let filtered = transformedOffers
  if (treatmentType) {
    filtered = filtered.filter(o => 
      o.treatmentType.toLowerCase().includes(treatmentType.toLowerCase())
    )
  }

  if (referralSourceId) {
    filtered = filtered.filter(o => 
      o.patient?.referralSourceId === referralSourceId
    )
  }

  if (currency) {
    filtered = filtered.filter(o => o.currency === currency)
  }

  // KPI hesaplamaları
  const totalOffers = filtered.length
  const acceptedOffers = filtered.filter(o => o.status === 'accepted' || o.statusDisplay === 'Kabul Edildi').length
  const totalSales = filtered
    .filter(o => o.status === 'accepted' || o.statusDisplay === 'Kabul Edildi')
    .reduce((sum, o) => sum + o.amount, 0)
  const conversionRate = totalOffers > 0 ? (acceptedOffers / totalOffers) * 100 : 0

  return {
    offers: filtered,
    summary: { 
      totalOffers, 
      totalSales: Math.round(totalSales * 100) / 100, 
      conversionRate: Math.round(conversionRate * 10) / 10 
    }
  }
} 