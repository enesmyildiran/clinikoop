import { NextRequest, NextResponse } from 'next/server'
import { getReports } from '@/lib/reports'
import { convertCurrencySync, DEFAULT_CURRENCY } from '@/lib/currency'
import { getClinicIdFromRequest } from '@/lib/clinic-routing'

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json()
    
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(request);
    if (!clinicId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Klinik bilgisi bulunamadı.' 
      }, { status: 400 });
    }
    
    // Tüm verileri al (filtreleme olmadan)
    const allData = await getReports({
      dateFrom: '',
      dateTo: '',
      currency: '',
      salesUserId: '',
      treatmentType: '',
      referralSourceId: '',
      page: 1,
      pageSize: 1000 // Tüm verileri al
    }, clinicId || undefined)

    // Filtreleme uygula
    let filteredOffers = allData.offers
    
    if (filters.dateFrom || filters.dateTo) {
      filteredOffers = filteredOffers.filter(offer => {
        const offerDate = new Date(offer.createdAt)
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null
        const toDate = filters.dateTo ? new Date(filters.dateTo) : null
        
        if (fromDate && offerDate < fromDate) return false
        if (toDate && offerDate > toDate) return false
        return true
      })
    }

    if (filters.salesUserId) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.salesUser.name.toLowerCase().includes(filters.salesUserId.toLowerCase())
      )
    }

    if (filters.treatmentType) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.treatmentType.toLowerCase().includes(filters.treatmentType.toLowerCase())
      )
    }

    if (filters.referralSourceId) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.patient?.referralSourceId === filters.referralSourceId
      )
    }

    // Para birimi dönüştürme
    const targetCurrency = filters.currency || DEFAULT_CURRENCY
    
    const convertedOffers = filteredOffers.map(offer => {
      const convertedAmount = convertCurrencySync(offer.amount, offer.currency as any, targetCurrency as any)
      return {
        ...offer,
        convertedAmount: Math.round(convertedAmount * 100) / 100, // 2 ondalık basamağa yuvarla
        originalAmount: offer.amount,
        originalCurrency: offer.currency
      }
    })

    // KPI hesaplamaları (tüm veriler üzerinden, sadece tarih filtresi varsa)
    const kpiOffers = filters.dateFrom || filters.dateTo ? filteredOffers : allData.offers
    
    const totalOffers = kpiOffers.length
    const acceptedOffers = kpiOffers.filter(offer => offer.status === 'accepted')
    const totalSales = acceptedOffers.reduce((sum, offer) => {
      const convertedAmount = convertCurrencySync(offer.amount, offer.currency as any, targetCurrency as any)
      return sum + Math.round(convertedAmount * 100) / 100
    }, 0)

    // Dönüşüm oranı hesaplama (kabul edilen teklif sayısı / toplam teklif sayısı)
    const conversionRate = totalOffers > 0 ? (acceptedOffers.length / totalOffers) * 100 : 0

    return NextResponse.json({
      success: true,
      offers: convertedOffers,
      summary: {
        totalOffers,
        totalSales: Math.round(totalSales * 100) / 100,
        conversionRate: Math.round(conversionRate * 10) / 10 // 1 ondalık basamağa yuvarla
      },
      targetCurrency
    })

  } catch (error) {
    console.error('Error in reports API:', error)
    return NextResponse.json(
      { success: false, message: 'Rapor oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
} 