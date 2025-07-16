'use client'

import { useState, useEffect } from 'react'
import { CURRENCIES, type CurrencyCode, DEFAULT_CURRENCY } from '@/lib/currency'
import CurrencySelect from './CurrencySelect'

interface PriceInputProps {
  value: number
  currency: CurrencyCode
  onPriceChange: (price: number) => void
  onCurrencyChange: (currency: CurrencyCode) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
  step?: number
}

export default function PriceInput({
  value,
  currency,
  onPriceChange,
  onCurrencyChange,
  placeholder = '0.00',
  className = '',
  disabled = false,
  required = false,
  min = 0,
  max,
  step = 0.01
}: PriceInputProps) {
  const [displayValue, setDisplayValue] = useState(value.toString())
  const [error, setError] = useState('')

  useEffect(() => {
    setDisplayValue(value.toString())
  }, [value])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)

    // Validasyon
    if (inputValue === '') {
      setError('')
      onPriceChange(0)
      return
    }

    const numValue = parseFloat(inputValue)
    
    if (isNaN(numValue)) {
      setError('Geçerli bir sayı girin')
      return
    }

    if (numValue < min) {
      setError(`Minimum değer ${min} olmalıdır`)
      return
    }

    if (max && numValue > max) {
      setError(`Maksimum değer ${max} olmalıdır`)
      return
    }

    setError('')
    onPriceChange(numValue)
  }

  const handleBlur = () => {
    // Input boşsa 0 olarak ayarla
    if (displayValue === '') {
      setDisplayValue('0')
      onPriceChange(0)
    }
  }

  const selectedCurrency = CURRENCIES[currency]

  return (
    <div className={className}>
      <div className="flex gap-2">
        {/* Fiyat Input */}
        <div className="flex-1 relative">
          <input
            type="number"
            value={displayValue}
            onChange={handlePriceChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
              ${required && !value ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            `}
          />
          {/* Para birimi simgesi (input içinde) */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <span className="text-gray-400">{selectedCurrency.symbol}</span>
          </div>
        </div>

        {/* Para birimi seçici */}
        <div className="w-48">
          <CurrencySelect
            value={currency}
            onChange={onCurrencyChange}
            disabled={disabled}
            required={required}
          />
        </div>
      </div>

      {/* Hata mesajı */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Gerekli alan uyarısı */}
      {required && !value && !error && (
        <p className="mt-1 text-sm text-red-600">Bu alan zorunludur</p>
      )}

      {/* Para birimi bilgisi */}
      <p className="mt-1 text-xs text-gray-500">
        {selectedCurrency.name} ({selectedCurrency.code})
      </p>
    </div>
  )
} 