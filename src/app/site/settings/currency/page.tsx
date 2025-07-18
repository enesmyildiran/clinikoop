"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaMoneyBillWave, FaExchangeAlt, FaGlobe, FaSave, FaUndo } from 'react-icons/fa'
import { useToast } from '@/components/ui/Toast'

const defaultCurrencySettings = {
  defaultCurrency: 'TRY',
  exchangeRateSource: 'TCMB',
  autoUpdateRates: true,
  updateInterval: '24',
  showExchangeRates: true,
  decimalPlaces: '2',
  currencyFormat: 'symbol',
  taxRate: '20',
  taxIncluded: false
}

const currencyOptions = [
  { code: 'TRY', name: 'Türk Lirası', symbol: '₺' },
  { code: 'USD', name: 'Amerikan Doları', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'İngiliz Sterlini', symbol: '£' },
  { code: 'JPY', name: 'Japon Yeni', symbol: '¥' },
  { code: 'CHF', name: 'İsviçre Frangı', symbol: 'CHF' },
  { code: 'CAD', name: 'Kanada Doları', symbol: 'C$' },
  { code: 'AUD', name: 'Avustralya Doları', symbol: 'A$' }
]

const exchangeRateSources = [
  { code: 'TCMB', name: 'Türkiye Cumhuriyet Merkez Bankası' },
  { code: 'ECB', name: 'Avrupa Merkez Bankası' },
  { code: 'FED', name: 'Amerikan Merkez Bankası' },
  { code: 'MANUAL', name: 'Manuel Giriş' }
]

export default function CurrencySettingsPage() {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(defaultCurrencySettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        const settingsData = data.data || [];
        
        const currencyData: any = {};
        settingsData.forEach((setting: any) => {
          if (setting.key.startsWith('currency.')) {
            const key = setting.key.replace('currency.', '');
            if (key === 'autoUpdateRates' || key === 'showExchangeRates' || key === 'taxIncluded') {
              currencyData[key] = setting.value === 'true';
            } else {
              currencyData[key] = setting.value;
            }
          }
        });

        if (Object.keys(currencyData).length > 0) {
          setSettings(prev => ({ ...prev, ...currencyData }));
        }
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const hasAnyChanges = Object.keys(settings).some(key => {
      const currentValue = settings[key as keyof typeof settings];
      const defaultValue = defaultCurrencySettings[key as keyof typeof defaultCurrencySettings];
      return currentValue !== defaultValue;
    });
    setHasChanges(hasAnyChanges);
  }, [settings]);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsData = [
        { key: 'currency.defaultCurrency', value: settings.defaultCurrency },
        { key: 'currency.exchangeRateSource', value: settings.exchangeRateSource },
        { key: 'currency.autoUpdateRates', value: settings.autoUpdateRates.toString() },
        { key: 'currency.updateInterval', value: settings.updateInterval },
        { key: 'currency.showExchangeRates', value: settings.showExchangeRates.toString() },
        { key: 'currency.decimalPlaces', value: settings.decimalPlaces },
        { key: 'currency.currencyFormat', value: settings.currencyFormat },
        { key: 'currency.taxRate', value: settings.taxRate },
        { key: 'currency.taxIncluded', value: settings.taxIncluded.toString() }
      ];

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsData })
      });

      if (response.ok) {
        addToast({ message: 'Para birimi ayarları başarıyla kaydedildi', type: 'success' });
        setHasChanges(false);
      } else {
        addToast({ message: 'Ayarlar kaydedilemedi', type: 'error' });
      }
    } catch (error) {
      addToast({ message: 'Bir hata oluştu', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setSettings(defaultCurrencySettings);
    addToast({ message: 'Ayarlar varsayılana sıfırlandı', type: 'info' });
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ayarlar yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/site/settings"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm">Ayarlara Dön</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Para Birimi Ayarları</h1>
            <p className="text-gray-600 text-sm">Varsayılan para birimi ve döviz kurları</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={resetToDefaults}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaUndo className="w-4 h-4" />
            Varsayılana Sıfırla
          </button>
          <button 
            onClick={saveSettings}
            disabled={isSaving || !hasChanges}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <FaSave className="w-4 h-4" />
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      {/* Para Birimi Ayarları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Temel Ayarlar */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaMoneyBillWave className="text-green-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-800">Temel Ayarlar</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Varsayılan Para Birimi *
              </label>
              <select 
                value={settings.defaultCurrency}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultCurrency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {currencyOptions.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} - {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Döviz Kuru Kaynağı
              </label>
              <select 
                value={settings.exchangeRateSource}
                onChange={(e) => setSettings(prev => ({ ...prev, exchangeRateSource: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {exchangeRateSources.map(source => (
                  <option key={source.code} value={source.code}>
                    {source.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ondalık Basamak Sayısı
              </label>
              <select 
                value={settings.decimalPlaces}
                onChange={(e) => setSettings(prev => ({ ...prev, decimalPlaces: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="0">0 (Tam sayı)</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Para Birimi Formatı
              </label>
              <select 
                value={settings.currencyFormat}
                onChange={(e) => setSettings(prev => ({ ...prev, currencyFormat: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="symbol">Sembol (₺100)</option>
                <option value="code">Kod (100 TRY)</option>
                <option value="name">İsim (100 Türk Lirası)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Döviz Kuru Ayarları */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaExchangeAlt className="text-blue-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-800">Döviz Kuru Ayarları</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Otomatik Kur Güncelleme</label>
                <p className="text-xs text-gray-500">Döviz kurlarını otomatik güncelle</p>
              </div>
              <input 
                type="checkbox"
                checked={settings.autoUpdateRates}
                onChange={(e) => setSettings(prev => ({ ...prev, autoUpdateRates: e.target.checked }))}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Güncelleme Sıklığı (Saat)
              </label>
              <select 
                value={settings.updateInterval}
                onChange={(e) => setSettings(prev => ({ ...prev, updateInterval: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">1 saat</option>
                <option value="6">6 saat</option>
                <option value="12">12 saat</option>
                <option value="24">24 saat</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Döviz Kurlarını Göster</label>
                <p className="text-xs text-gray-500">Tekliflerde döviz kurlarını göster</p>
              </div>
              <input 
                type="checkbox"
                checked={settings.showExchangeRates}
                onChange={(e) => setSettings(prev => ({ ...prev, showExchangeRates: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Vergi Ayarları */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaGlobe className="text-purple-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-800">Vergi Ayarları</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vergi Oranı (%)
              </label>
              <input 
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => setSettings(prev => ({ ...prev, taxRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="20"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Vergi Dahil Fiyat</label>
                <p className="text-xs text-gray-500">Fiyatlar vergi dahil mi?</p>
              </div>
              <input 
                type="checkbox"
                checked={settings.taxIncluded}
                onChange={(e) => setSettings(prev => ({ ...prev, taxIncluded: e.target.checked }))}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Önizleme */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaGlobe className="text-indigo-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-800">Önizleme</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Örnek Fiyat Formatı</h4>
              <div className="text-2xl font-bold text-green-600">
                {(() => {
                  const currency = currencyOptions.find(c => c.code === settings.defaultCurrency);
                  const symbol = currency?.symbol || settings.defaultCurrency;
                  const format = settings.currencyFormat;
                  const value = 1500.50;
                  
                  switch (format) {
                    case 'symbol':
                      return `${symbol}${value.toFixed(parseInt(settings.decimalPlaces))}`;
                    case 'code':
                      return `${value.toFixed(parseInt(settings.decimalPlaces))} ${settings.defaultCurrency}`;
                    case 'name':
                      return `${value.toFixed(parseInt(settings.decimalPlaces))} ${currency?.name}`;
                    default:
                      return `${symbol}${value.toFixed(parseInt(settings.decimalPlaces))}`;
                  }
                })()}
              </div>
              {settings.taxIncluded && (
                <p className="text-sm text-gray-600 mt-1">Vergi dahil</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Değişiklik Uyarısı */}
      {hasChanges && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-800">
              Kaydedilmemiş değişiklikleriniz var. Değişiklikleri kaydetmek için "Kaydet" butonuna tıklayın.
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 