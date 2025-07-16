import { ExchangeRate, fetchExchangeRates, convertCurrency as convertCurrencyWithRates } from './exchange-rates'

// Desteklenen para birimleri
export const CURRENCIES = {
  TRY: {
    code: 'TRY',
    symbol: '₺',
    name: 'Türk Lirası',
    locale: 'tr-TR',
    position: 'after' as const
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Amerikan Doları',
    locale: 'en-US',
    position: 'before' as const
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    position: 'before' as const
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'İngiliz Sterlini',
    locale: 'en-GB',
    position: 'before' as const
  }
} as const

export type CurrencyCode = 'TRY' | 'USD' | 'EUR' | 'GBP'

// Para birimi formatlama fonksiyonu
export function formatCurrency(amount: number, currencyCode: CurrencyCode): string {
  const currency = CURRENCIES[currencyCode]
  
  try {
    const formatter = new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
    
    return formatter.format(amount)
  } catch (error) {
    // Fallback formatlama
    const formattedAmount = new Intl.NumberFormat(currency.locale).format(amount)
    return currency.position === 'before' 
      ? `${currency.symbol}${formattedAmount}`
      : `${formattedAmount}${currency.symbol}`
  }
}

// Para birimi simgesi ile formatlama (sadece simge)
export function formatCurrencySymbol(amount: number, currencyCode: CurrencyCode): string {
  const currency = CURRENCIES[currencyCode]
  const formattedAmount = new Intl.NumberFormat(currency.locale).format(amount)
  
  return currency.position === 'before' 
    ? `${currency.symbol}${formattedAmount}`
    : `${formattedAmount}${currency.symbol}`
}

// Para birimi seçenekleri (dropdown için)
export const CURRENCY_OPTIONS = [
  { value: 'TRY', label: 'Türk Lirası (₺)' },
  { value: 'USD', label: 'Amerikan Doları ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'İngiliz Sterlini (£)' }
]

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£'
}

export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  TRY: 'Türk Lirası',
  USD: 'Amerikan Doları',
  EUR: 'Euro',
  GBP: 'İngiliz Sterlini'
}

// Varsayılan para birimi
export const DEFAULT_CURRENCY: CurrencyCode = 'TRY'

// Döviz kurları (varsayılan değerler)
let exchangeRates: Record<string, number> = {
  'TRY-USD': 0.031,
  'TRY-EUR': 0.029,
  'TRY-GBP': 0.025,
  'USD-TRY': 32.0,
  'USD-EUR': 0.93,
  'USD-GBP': 0.80,
  'EUR-TRY': 34.5,
  'EUR-USD': 1.08,
  'EUR-GBP': 0.86,
  'GBP-TRY': 40.0,
  'GBP-USD': 1.25,
  'GBP-EUR': 1.16
}

export function setExchangeRates(rates: Record<string, number>) {
  exchangeRates = { ...exchangeRates, ...rates }
}

export function getExchangeRate(from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return 1
  
  const key = `${from}-${to}`
  const reverseKey = `${to}-${from}`
  
  if (exchangeRates[key]) {
    return exchangeRates[key]
  }
  
  if (exchangeRates[reverseKey]) {
    return 1 / exchangeRates[reverseKey]
  }
  
  // Fallback: USD üzerinden hesapla
  if (from !== 'USD' && to !== 'USD') {
    const fromToUSD = getExchangeRate(from, 'USD')
    const usdToTo = getExchangeRate('USD', to)
    return fromToUSD * usdToTo
  }
  
  return 1
}

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  const rate = getExchangeRate(from, to)
  return amount * rate
}

export function convertCurrencySync(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  const rate = getExchangeRate(from, to)
  return Math.round(amount * rate * 100) / 100 // 2 ondalık basamağa yuvarla
}

export function formatCurrencyCode(amount: number, currency: CurrencyCode): string {
  const formattedAmount = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
  
  return `${formattedAmount} ${currency}`
}

// Toplam hesaplama (aynı para biriminde)
export async function calculateTotal(
  items: Array<{ amount: number; currency: CurrencyCode }>,
  targetCurrency: CurrencyCode = 'TRY'
): Promise<number> {
  let total = 0
  
  for (const item of items) {
    const convertedAmount = await convertCurrency(item.amount, item.currency, targetCurrency)
    total += convertedAmount
  }
  
  return total
}

// Senkron toplam hesaplama
export function calculateTotalSync(
  items: Array<{ amount: number; currency: CurrencyCode }>,
  targetCurrency: CurrencyCode = 'TRY'
): number {
  return items.reduce((total, item) => {
    const convertedAmount = convertCurrencySync(item.amount, item.currency, targetCurrency)
    return total + convertedAmount
  }, 0)
}

// Para birimi validasyonu
export function validateCurrency(currencyCode: string): currencyCode is CurrencyCode {
  return currencyCode in CURRENCIES
}

// Döviz kurlarını yenile
export async function refreshExchangeRates(): Promise<ExchangeRate[]> {
  // Implementation needed
  throw new Error("Method not implemented")
}

// Mevcut döviz kurlarını al
export function getCurrentExchangeRates(): ExchangeRate[] {
  // Implementation needed
  throw new Error("Method not implemented")
} 