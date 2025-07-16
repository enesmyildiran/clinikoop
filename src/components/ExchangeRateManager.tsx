'use client';

import { useState, useEffect } from 'react';
import { FaSync, FaDownload, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { ExchangeRate } from '@/lib/exchange-rates';

interface ExchangeRateManagerProps {
  onRatesUpdate?: (rates: ExchangeRate[]) => void;
}

export default function ExchangeRateManager({ onRatesUpdate }: ExchangeRateManagerProps) {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/exchange-rates');
      const data = await response.json();
      
      if (data.success) {
        setRates(data.rates);
        // Güvenli tarih dönüşümü
        if (data.lastUpdate) {
          try {
            const updateDate = new Date(data.lastUpdate);
            if (!isNaN(updateDate.getTime())) {
              setLastUpdate(updateDate);
            } else {
              setLastUpdate(new Date());
            }
          } catch {
            setLastUpdate(new Date());
          }
        } else {
          setLastUpdate(new Date());
        }
        onRatesUpdate?.(data.rates);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Döviz kurları alınırken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const manualUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/exchange-rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'manual-update' }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRates(data.rates);
        setLastUpdate(new Date());
        onRatesUpdate?.(data.rates);
        alert('Döviz kurları başarıyla güncellendi!');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Güncelleme sırasında hata oluştu');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const formatDate = (date: Date | string | null) => {
    if (!date) {
      return 'Geçersiz tarih';
    }
    
    let dateObj: Date;
    
    // String ise Date objesine çevir
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    // Geçerli tarih kontrolü
    if (isNaN(dateObj.getTime())) {
      return 'Geçersiz tarih';
    }
    
    try {
      return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    } catch (error) {
      return 'Tarih formatlanamadı';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaDownload className="text-green-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Döviz Kuru Yönetimi</h3>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={fetchRates}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            <FaSync className={isLoading ? 'animate-spin' : ''} />
            Yenile
          </button>
          
          <button
            onClick={manualUpdate}
            disabled={isUpdating}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FaSync className={isUpdating ? 'animate-spin' : ''} />
            Manuel Güncelle
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <FaExclamationTriangle className="text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {lastUpdate && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <FaClock />
          <span>Son güncelleme: {formatDate(lastUpdate)}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-gray-700">Para Birimi</th>
              <th className="text-right py-2 font-medium text-gray-700">Kur (TRY)</th>
              <th className="text-right py-2 font-medium text-gray-700">Son Güncelleme</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => (
              <tr key={rate.currency} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 font-medium text-gray-800">
                  {rate.currency}
                </td>
                <td className="py-2 text-right text-gray-600">
                  {rate.currency === 'TRY' ? '1.0000' : rate.rate.toFixed(4)}
                </td>
                <td className="py-2 text-right text-gray-500 text-xs">
                  {formatDate(rate.lastUpdated)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Bilgi:</strong> Döviz kurları günde bir kez otomatik olarak güncellenir. 
          Manuel güncelleme ile anlık kurları alabilirsiniz.
        </div>
      </div>
    </div>
  );
} 