"use client"

import React, { useState } from 'react';
import { Input } from './Input';

// Ülke bayrakları için emoji mapping
const countryFlags: { [key: string]: string } = {
  'TR': '🇹🇷',
  'US': '🇺🇸',
  'GB': '🇬🇧',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'IT': '🇮🇹',
  'ES': '🇪🇸',
  'NL': '🇳🇱',
  'BE': '🇧🇪',
  'CH': '🇨🇭',
  'AT': '🇦🇹',
  'SE': '🇸🇪',
  'NO': '🇳🇴',
  'DK': '🇩🇰',
  'FI': '🇫🇮',
  'PL': '🇵🇱',
  'CZ': '🇨🇿',
  'HU': '🇭🇺',
  'RO': '🇷🇴',
  'BG': '🇧🇬',
  'HR': '🇭🇷',
  'SI': '🇸🇮',
  'SK': '🇸🇰',
  'LT': '🇱🇹',
  'LV': '🇱🇻',
  'EE': '🇪🇪',
  'IE': '🇮🇪',
  'PT': '🇵🇹',
  'GR': '🇬🇷',
  'CY': '🇨🇾',
  'MT': '🇲🇹',
  'LU': '🇱🇺',
  'default': '🌍'
};

// Ülke kodları ve telefon kodları
const countryCodes: { [key: string]: string } = {
  'TR': '+90',
  'US': '+1',
  'GB': '+44',
  'DE': '+49',
  'FR': '+33',
  'IT': '+39',
  'ES': '+34',
  'NL': '+31',
  'BE': '+32',
  'CH': '+41',
  'AT': '+43',
  'SE': '+46',
  'NO': '+47',
  'DK': '+45',
  'FI': '+358',
  'PL': '+48',
  'CZ': '+420',
  'HU': '+36',
  'RO': '+40',
  'BG': '+359',
  'HR': '+385',
  'SI': '+386',
  'SK': '+421',
  'LT': '+370',
  'LV': '+371',
  'EE': '+372',
  'IE': '+353',
  'PT': '+351',
  'GR': '+30',
  'CY': '+357',
  'MT': '+356',
  'LU': '+352'
};

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  country?: string;
  onCountryChange?: (country: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  country = 'TR',
  onCountryChange,
  placeholder = "Telefon numarası",
  error,
  className = ""
}) => {
  const [showCountrySelect, setShowCountrySelect] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phoneValue = e.target.value;
    
    // Sadece rakamları ve + işaretini kabul et
    phoneValue = phoneValue.replace(/[^\d+]/g, '');
    
    // Eğer ülke kodu ile başlamıyorsa, ülke kodunu ekle
    const countryCode = countryCodes[country];
    if (phoneValue && !phoneValue.startsWith('+')) {
      if (phoneValue.startsWith('0')) {
        phoneValue = phoneValue.substring(1);
      }
      phoneValue = countryCode + phoneValue;
    }
    
    onChange(phoneValue);
  };

  const getDisplayValue = () => {
    if (!value) return '';
    
    // Eğer zaten ülke kodu ile başlıyorsa, olduğu gibi göster
    if (value.startsWith('+')) {
      return value;
    }
    
    // Değilse, ülke kodunu ekle
    const countryCode = countryCodes[country];
    if (value.startsWith('0')) {
      return countryCode + value.substring(1);
    }
    return countryCode + value;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Ülke Seçici */}
        <button
          type="button"
          onClick={() => setShowCountrySelect(!showCountrySelect)}
          className="flex items-center gap-2 px-3 h-10 text-base border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <img src={`https://flagcdn.com/24x18/${country.toLowerCase()}.png`} alt={country} className="w-5 h-4 rounded-sm" />
          <span className="text-sm font-medium">{countryCodes[country]}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Telefon Input */}
        <Input
          type="tel"
          value={getDisplayValue()}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          error={error}
          className="rounded-l-none flex-1"
        />
      </div>

      {/* Ülke Seçim Dropdown */}
      {showCountrySelect && (
        <div className="absolute top-full left-0 z-50 w-64 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
          <div className="p-2">
            <input
              type="text"
              placeholder="Ülke ara..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {Object.entries(countryFlags).map(([code, flag]) => {
              if (code === 'default') return null;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    onCountryChange?.(code);
                    setShowCountrySelect(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left"
                >
                  <span className="text-lg">{flag}</span>
                  <span className="flex-1 text-sm">
                    {code === 'TR' ? 'Türkiye' :
                     code === 'US' ? 'Amerika Birleşik Devletleri' :
                     code === 'GB' ? 'Birleşik Krallık' :
                     code === 'DE' ? 'Almanya' :
                     code === 'FR' ? 'Fransa' :
                     code === 'IT' ? 'İtalya' :
                     code === 'ES' ? 'İspanya' :
                     code === 'NL' ? 'Hollanda' :
                     code === 'BE' ? 'Belçika' :
                     code === 'CH' ? 'İsviçre' :
                     code === 'AT' ? 'Avusturya' :
                     code === 'SE' ? 'İsveç' :
                     code === 'NO' ? 'Norveç' :
                     code === 'DK' ? 'Danimarka' :
                     code === 'FI' ? 'Finlandiya' :
                     code === 'PL' ? 'Polonya' :
                     code === 'CZ' ? 'Çek Cumhuriyeti' :
                     code === 'HU' ? 'Macaristan' :
                     code === 'RO' ? 'Romanya' :
                     code === 'BG' ? 'Bulgaristan' :
                     code === 'HR' ? 'Hırvatistan' :
                     code === 'SI' ? 'Slovenya' :
                     code === 'SK' ? 'Slovakya' :
                     code === 'LT' ? 'Litvanya' :
                     code === 'LV' ? 'Letonya' :
                     code === 'EE' ? 'Estonya' :
                     code === 'IE' ? 'İrlanda' :
                     code === 'PT' ? 'Portekiz' :
                     code === 'GR' ? 'Yunanistan' :
                     code === 'CY' ? 'Kıbrıs' :
                     code === 'MT' ? 'Malta' :
                     code === 'LU' ? 'Lüksemburg' : code}
                  </span>
                  <span className="text-sm text-gray-500">{countryCodes[code]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
