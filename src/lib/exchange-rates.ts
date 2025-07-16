// Exchange Rate API Integration
export interface ExchangeRate {
  currency: string;
  rate: number;
  lastUpdated: Date;
}

export interface ExchangeRateResponse {
  success: boolean;
  rates: Record<string, number>;
  base: string;
  date: string;
}

// Free Exchange Rate API (ExchangeRate-API)
const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/TRY';

// Cache for exchange rates
let cachedRates: ExchangeRate[] = [];
let lastFetchTime: Date | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  try {
    // Check if we have cached rates and they're still valid
    if (cachedRates.length > 0 && lastFetchTime) {
      const timeSinceLastFetch = Date.now() - lastFetchTime.getTime();
      if (timeSinceLastFetch < CACHE_DURATION) {
        return cachedRates;
      }
    }

    console.log('Fetching exchange rates from API...');
    
    const response = await fetch(EXCHANGE_RATE_API_URL);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();
    
    if (!data.success && !data.rates) {
      throw new Error('Invalid API response');
    }

    // Convert to our format (TRY is base currency)
    const rates: ExchangeRate[] = Object.entries(data.rates).map(([currency, rate]) => ({
      currency,
      rate: 1 / rate, // Convert from TRY to currency
      lastUpdated: new Date()
    }));

    // Add TRY as base currency
    rates.unshift({
      currency: 'TRY',
      rate: 1,
      lastUpdated: new Date()
    });

    // Update cache
    cachedRates = rates;
    lastFetchTime = new Date();

    console.log('Exchange rates updated successfully');
    return rates;

  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Return cached rates if available, otherwise return default rates
    if (cachedRates.length > 0) {
      console.log('Using cached exchange rates');
      return cachedRates;
    }

    // Fallback to default rates
    return getDefaultExchangeRates();
  }
}

export function getDefaultExchangeRates(): ExchangeRate[] {
  return [
    { currency: 'TRY', rate: 1, lastUpdated: new Date() },
    { currency: 'USD', rate: 0.031, lastUpdated: new Date() },
    { currency: 'EUR', rate: 0.029, lastUpdated: new Date() },
    { currency: 'GBP', rate: 0.025, lastUpdated: new Date() },
    { currency: 'JPY', rate: 4.65, lastUpdated: new Date() },
    { currency: 'CAD', rate: 0.042, lastUpdated: new Date() },
    { currency: 'AUD', rate: 0.047, lastUpdated: new Date() },
    { currency: 'CHF', rate: 0.027, lastUpdated: new Date() },
    { currency: 'CNY', rate: 0.22, lastUpdated: new Date() },
    { currency: 'INR', rate: 2.58, lastUpdated: new Date() }
  ];
}

export function convertCurrency(
  amount: number, 
  fromCurrency: string, 
  toCurrency: string, 
  rates: ExchangeRate[]
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromRate = rates.find(r => r.currency === fromCurrency)?.rate;
  const toRate = rates.find(r => r.currency === toCurrency)?.rate;

  if (!fromRate || !toRate) {
    console.warn(`Exchange rate not found for ${fromCurrency} or ${toCurrency}`);
    return amount; // Return original amount if conversion not possible
  }

  // Convert to TRY first, then to target currency
  const amountInTRY = amount / fromRate;
  return amountInTRY * toRate;
}

export function getLastUpdateTime(): Date | null {
  return lastFetchTime;
}

export function clearCache(): void {
  cachedRates = [];
  lastFetchTime = null;
}

// Manual update function for admin
export async function manualUpdateExchangeRates(): Promise<{
  success: boolean;
  message: string;
  rates?: ExchangeRate[];
}> {
  try {
    clearCache(); // Clear cache to force fresh fetch
    const rates = await fetchExchangeRates();
    
    return {
      success: true,
      message: 'Döviz kurları başarıyla güncellendi',
      rates
    };
  } catch (error) {
    return {
      success: false,
      message: 'Döviz kurları güncellenirken hata oluştu'
    };
  }
} 