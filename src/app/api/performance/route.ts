import { NextRequest, NextResponse } from 'next/server';
import { getReports } from '@/lib/reports';
import { convertCurrencySync, DEFAULT_CURRENCY } from '@/lib/currency';
import { getClinicIdFromRequest } from '@/lib/clinic-routing';

export async function GET() {
  try {
    const clinicId = await getClinicIdFromRequest(new NextRequest('http://localhost:3000/api/performance'));
    if (!clinicId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Klinik bilgisi bulunamadı.' 
      }, { status: 400 });
    }

    // Default parametrelerle POST'u çağır
    const defaultRequest = new NextRequest('http://localhost:3000/api/performance', {
      method: 'POST',
      body: JSON.stringify({ timeRange: 'month', targetCurrency: DEFAULT_CURRENCY })
    });
    
    return POST(defaultRequest);
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Performance verisi alınamadı.' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { timeRange, targetCurrency } = await request.json();
    
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(request);
    if (!clinicId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Klinik bilgisi bulunamadı.' 
      }, { status: 400 });
    }
    
    // Tüm verileri al
    const allData = await getReports({
      dateFrom: '',
      dateTo: '',
      currency: '',
      salesUserId: '',
      treatmentType: '',
      page: 1,
      pageSize: 1000
    }, clinicId || undefined);

    console.log('🎯 Performance API - getReports sonucu:', {
      clinicId,
      totalOffers: allData.offers.length,
      firstOffer: allData.offers[0] ? {
        id: allData.offers[0].id,
        status: allData.offers[0].status,
        statusDisplay: allData.offers[0].statusDisplay,
        createdAt: allData.offers[0].createdAt
      } : null
    });

    const offers = allData.offers;
    const targetCurr = targetCurrency || DEFAULT_CURRENCY;

    // Zaman aralığına göre filtrele
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Eğer hiç teklif yoksa veya tüm teklifler eski tarihliyse, tüm teklifleri göster
    const filteredOffers = offers.filter(offer => {
      const offerDate = new Date(offer.createdAt);
      return offerDate >= startDate && offerDate <= now;
    });

    // Eğer filtrelenmiş teklif yoksa, tüm teklifleri göster (demo amaçlı)
    const offersToUse = filteredOffers.length > 0 ? filteredOffers : offers;

    console.log('🎯 Performance API - Filtreleme sonucu:', {
      originalCount: offers.length,
      filteredCount: filteredOffers.length,
      offersToUseCount: offersToUse.length,
      startDate: startDate.toISOString(),
      now: now.toISOString(),
      firstFilteredOffer: filteredOffers[0] ? {
        id: filteredOffers[0].id,
        status: filteredOffers[0].status,
        createdAt: filteredOffers[0].createdAt
      } : null
    });

    // Toplam hesaplamalar - status field'ını kullan
    const acceptedOffers = offersToUse.filter(offer => {
      const status = offer.status || offer.statusDisplay || '';
      return status.toLowerCase().includes('accepted') || 
             status.toLowerCase().includes('kabul') ||
             status === 'accepted' || 
             status === 'Kabul Edildi';
    });
    
    const totalRevenue = acceptedOffers.reduce((sum, offer) => {
      const convertedAmount = convertCurrencySync(offer.amount, offer.currency as any, targetCurr as any);
      return sum + convertedAmount;
    }, 0);

    const totalPatients = new Set(offersToUse.map(offer => offer.patientName)).size;
    const totalOffers = offersToUse.length;
    const acceptedOffersCount = acceptedOffers.length;
    const successRate = totalOffers > 0 ? (acceptedOffersCount / totalOffers) * 100 : 0;

    // Aylık veriler
    const monthlyData = offersToUse.reduce((acc, offer) => {
      const date = new Date(offer.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('tr-TR', { month: 'long' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthName,
          revenue: 0,
          patients: new Set(),
          offers: 0,
          acceptedOffers: 0
        };
      }
      
      if (offer.status === 'accepted' || offer.status === 'Kabul Edildi' || offer.statusDisplay === 'Kabul Edildi') {
        const convertedAmount = convertCurrencySync(offer.amount, offer.currency as any, targetCurr as any);
        acc[monthKey].revenue += convertedAmount;
        acc[monthKey].acceptedOffers += 1;
      }
      
      acc[monthKey].patients.add(offer.patientName);
      acc[monthKey].offers += 1;
      
      return acc;
    }, {} as Record<string, { month: string; revenue: number; patients: Set<string>; offers: number; acceptedOffers: number }>);

    const monthlyChartData = Object.values(monthlyData)
      .map(item => ({
        month: item.month,
        revenue: Math.round(item.revenue * 100) / 100,
        patients: item.patients.size,
        offers: item.offers,
        successRate: item.offers > 0 ? (item.acceptedOffers / item.offers) * 100 : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Para birimi dağılımı
    const currencyDistribution = offersToUse
      .filter(offer => offer.status === 'accepted' || offer.status === 'Kabul Edildi' || offer.statusDisplay === 'Kabul Edildi')
      .reduce((acc, offer) => {
        const currency = offer.currency || 'TRY';
        if (!acc[currency]) {
          acc[currency] = { currency, amount: 0, count: 0 };
        }
        const convertedAmount = convertCurrencySync(offer.amount, offer.currency as any, targetCurr as any);
        acc[currency].amount += convertedAmount;
        acc[currency].count += 1;
        return acc;
      }, {} as Record<string, { currency: string; amount: number; count: number }>);

    const totalAmount = Object.values(currencyDistribution).reduce((sum, item) => sum + item.amount, 0);
    
    const currencyChartData = Object.values(currencyDistribution)
      .map(item => ({
        currency: item.currency,
        amount: Math.round(item.amount * 100) / 100,
        percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    return NextResponse.json({
      success: true,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalPatients,
      totalOffers,
      successRate: Math.round(successRate * 10) / 10,
      monthlyData: monthlyChartData,
      currencyDistribution: currencyChartData,
      targetCurrency: targetCurr
    });

  } catch (error) {
    console.error('Error in performance API:', error);
    return NextResponse.json(
      { success: false, message: 'Performans verileri alınamadı' },
      { status: 500 }
    );
  }
} 