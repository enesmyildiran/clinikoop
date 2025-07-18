import { NextRequest, NextResponse } from 'next/server';
import { setExchangeRates } from '@/lib/currency';

export async function GET() {
  try {
    const now = new Date();
    // ExchangeRateManager'ın beklediği format
    const rates = [
      { currency: 'TRY', rate: 1, lastUpdated: now },
      { currency: 'USD', rate: 0.031, lastUpdated: now },
      { currency: 'EUR', rate: 0.029, lastUpdated: now },
      { currency: 'GBP', rate: 0.025, lastUpdated: now },
      { currency: 'JPY', rate: 4.65, lastUpdated: now },
      { currency: 'CAD', rate: 0.042, lastUpdated: now },
      { currency: 'AUD', rate: 0.047, lastUpdated: now },
      { currency: 'CHF', rate: 0.027, lastUpdated: now },
      { currency: 'CNY', rate: 0.22, lastUpdated: now },
      { currency: 'INR', rate: 2.58, lastUpdated: now }
    ];

    return NextResponse.json({
      success: true,
      rates: rates,
      lastUpdate: now.toISOString()
    });
  } catch (error) {
    console.error('Error in exchange rates API:', error);
    return NextResponse.json(
      { success: false, message: 'Döviz kurları alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'manual-update') {
      // Ücretsiz API'den güncel kurları al
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
        const data = await response.json();
        
        if (data.rates) {
          const now = new Date();
          // ExchangeRateManager'ın beklediği format
          const rates = [
            { currency: 'TRY', rate: 1, lastUpdated: now },
            { currency: 'USD', rate: data.rates.USD || 0.031, lastUpdated: now },
            { currency: 'EUR', rate: data.rates.EUR || 0.029, lastUpdated: now },
            { currency: 'GBP', rate: data.rates.GBP || 0.025, lastUpdated: now },
            { currency: 'JPY', rate: data.rates.JPY || 4.65, lastUpdated: now },
            { currency: 'CAD', rate: data.rates.CAD || 0.042, lastUpdated: now },
            { currency: 'AUD', rate: data.rates.AUD || 0.047, lastUpdated: now },
            { currency: 'CHF', rate: data.rates.CHF || 0.027, lastUpdated: now },
            { currency: 'CNY', rate: data.rates.CNY || 0.22, lastUpdated: now },
            { currency: 'INR', rate: data.rates.INR || 2.58, lastUpdated: now }
          ];
          
          // Eski format için de güncelle
          const oldFormatRates: Record<string, number> = {};
          rates.forEach(rate => {
            if (rate.currency !== 'TRY') {
              oldFormatRates[`TRY-${rate.currency}`] = rate.rate;
              oldFormatRates[`${rate.currency}-TRY`] = 1 / rate.rate;
            }
          });
          
          // Kurları güncelle
          setExchangeRates(oldFormatRates);
          
          return NextResponse.json({
            success: true,
            message: 'Döviz kurları başarıyla güncellendi',
            rates: rates,
            lastUpdate: now.toISOString()
          });
        } else {
          throw new Error('API yanıtında kurlar bulunamadı');
        }
      } catch (apiError) {
        console.error('Error fetching exchange rates:', apiError);
        return NextResponse.json({
          success: false,
          message: 'Döviz kurları güncellenirken hata oluştu. Varsayılan kurlar kullanılıyor.'
        }, { status: 500 });
      }
    }
    
    return NextResponse.json(
      { success: false, message: 'Geçersiz işlem' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in exchange rates API:', error);
    return NextResponse.json(
      { success: false, message: 'İşlem sırasında hata oluştu' },
      { status: 500 }
    );
  }
} 