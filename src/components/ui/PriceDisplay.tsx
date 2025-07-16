import { formatCurrency, formatCurrencySymbol, type CurrencyCode } from '@/lib/currency'

interface PriceDisplayProps {
  amount: number
  currency: CurrencyCode
  format?: 'full' | 'symbol' | 'compact'
  className?: string
  showCurrencyCode?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function PriceDisplay({
  amount,
  currency,
  format = 'full',
  className = '',
  showCurrencyCode = false,
  size = 'md'
}: PriceDisplayProps) {
  const getFormattedPrice = () => {
    switch (format) {
      case 'symbol':
        return formatCurrencySymbol(amount, currency)
      case 'compact':
        return formatCurrencySymbol(amount, currency)
      case 'full':
      default:
        return formatCurrency(amount, currency)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm'
      case 'md':
        return 'text-base'
      case 'lg':
        return 'text-lg'
      case 'xl':
        return 'text-xl font-semibold'
      default:
        return 'text-base'
    }
  }

  const formattedPrice = getFormattedPrice()
  const sizeClasses = getSizeClasses()

  return (
    <span className={`${sizeClasses} ${className}`}>
      {formattedPrice}
      {showCurrencyCode && (
        <span className="text-gray-500 text-xs ml-1">({currency})</span>
      )}
    </span>
  )
}

// Kompakt fiyat gösterimi (kartlar için)
export function CompactPriceDisplay({
  amount,
  currency,
  className = ''
}: {
  amount: number
  currency: CurrencyCode
  className?: string
}) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-lg font-semibold">
        {formatCurrencySymbol(amount, currency)}
      </span>
      <span className="text-xs text-gray-500">({currency})</span>
    </div>
  )
}

// Büyük fiyat gösterimi (dashboard için)
export function LargePriceDisplay({
  amount,
  currency,
  label,
  className = ''
}: {
  amount: number
  currency: CurrencyCode
  label?: string
  className?: string
}) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-3xl font-bold text-gray-800">
        {formatCurrencySymbol(amount, currency)}
      </div>
      {label && (
        <div className="text-sm text-gray-500 mt-1">{label}</div>
      )}
    </div>
  )
} 