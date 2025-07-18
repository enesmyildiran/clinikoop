"use client"

import { useState, useEffect } from 'react'
import { FaSave, FaCog, FaUndo, FaArrowLeft } from 'react-icons/fa'
import { useToast } from '@/components/ui/Toast'
import Link from 'next/link'

const defaultGeneralSettings = {
  clinicName: 'Clinikoop Diş Klinikleri',
  clinicEmail: 'info@clinikoop.com',
  clinicPhone: '+90 212 123 4567',
  clinicAddress: 'İstanbul, Türkiye',
  taxNumber: '1234567890',
  workingHours: '09:00 - 18:00'
}

export default function GeneralSettingsPage() {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(defaultGeneralSettings);
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
        
        const generalData: any = {};
        settingsData.forEach((setting: any) => {
          if (setting.key.startsWith('general.')) {
            const key = setting.key.replace('general.', '');
            generalData[key] = setting.value;
          }
        });

        if (Object.keys(generalData).length > 0) {
          setSettings(prev => ({ ...prev, ...generalData }));
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
      const defaultValue = defaultGeneralSettings[key as keyof typeof defaultGeneralSettings];
      return currentValue !== defaultValue;
    });
    setHasChanges(hasAnyChanges);
  }, [settings]);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsData = [
        { key: 'general.clinicName', value: settings.clinicName },
        { key: 'general.clinicEmail', value: settings.clinicEmail },
        { key: 'general.clinicPhone', value: settings.clinicPhone },
        { key: 'general.clinicAddress', value: settings.clinicAddress },
        { key: 'general.taxNumber', value: settings.taxNumber },
        { key: 'general.workingHours', value: settings.workingHours }
      ];

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsData })
      });

      if (response.ok) {
        addToast({ message: 'Genel ayarlar başarıyla kaydedildi', type: 'success' });
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
    setSettings(defaultGeneralSettings);
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
            <h1 className="text-2xl font-bold text-gray-800">Genel Ayarlar</h1>
            <p className="text-gray-600 text-sm">Sistem genel ayarları ve temel yapılandırma</p>
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FaSave className="w-4 h-4" />
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      {/* Genel Ayarlar Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaCog className="text-blue-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Klinik Bilgileri</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Klinik Adı *
            </label>
            <input 
              type="text"
              value={settings.clinicName}
              onChange={(e) => setSettings(prev => ({ ...prev, clinicName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Klinik adını girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta Adresi
            </label>
            <input 
              type="email"
              value={settings.clinicEmail}
              onChange={(e) => setSettings(prev => ({ ...prev, clinicEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="E-posta adresini girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon Numarası
            </label>
            <input 
              type="tel"
              value={settings.clinicPhone}
              onChange={(e) => setSettings(prev => ({ ...prev, clinicPhone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Telefon numarasını girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vergi Numarası
            </label>
            <input 
              type="text"
              value={settings.taxNumber}
              onChange={(e) => setSettings(prev => ({ ...prev, taxNumber: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Vergi numarasını girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Çalışma Saatleri
            </label>
            <input 
              type="text"
              value={settings.workingHours}
              onChange={(e) => setSettings(prev => ({ ...prev, workingHours: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="09:00 - 18:00"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adres
            </label>
            <textarea 
              value={settings.clinicAddress}
              onChange={(e) => setSettings(prev => ({ ...prev, clinicAddress: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Klinik adresini girin"
            />
          </div>
        </div>
      </div>

      {/* Değişiklik Uyarısı */}
      {hasChanges && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-800">
              Kaydedilmemiş değişiklikleriniz var. Değişiklikleri kaydetmek için &quot;Kaydet&quot; butonuna tıklayın.
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 