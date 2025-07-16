'use client'

import { useState, useRef, useEffect } from 'react'
import { FaChevronDown, FaCheck } from 'react-icons/fa'
import { CURRENCIES, CURRENCY_OPTIONS, type CurrencyCode } from '@/lib/currency'

interface CurrencySelectProps {
  value: CurrencyCode
  onChange: (currency: CurrencyCode) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

export default function CurrencySelect({
  value,
  onChange,
  placeholder = 'Para birimi seçin',
  className = '',
  disabled = false,
  required = false
}: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedCurrency = CURRENCIES[value]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (currencyCode: CurrencyCode) => {
    onChange(currencyCode)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}
          ${required && !value ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {value ? (
              <>
                <span className="text-lg">{selectedCurrency.symbol}</span>
                <span className="font-medium">{selectedCurrency.name}</span>
                <span className="text-gray-500 text-sm">({selectedCurrency.code})</span>
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <FaChevronDown 
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {CURRENCY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value as CurrencyCode)}
              className={`
                w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between
                ${value === option.value ? 'bg-blue-50 text-blue-600' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{CURRENCIES[option.value as CurrencyCode].symbol}</span>
                <span>{option.label}</span>
              </div>
              {value === option.value && <FaCheck className="text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 