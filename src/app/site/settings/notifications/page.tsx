"use client"

import { useState, useEffect } from 'react'
import { FaSave, FaBell, FaUndo, FaArrowLeft } from 'react-icons/fa'
import { useToast } from '@/components/ui/Toast'
import Link from 'next/link'

const defaultNotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  reminderNotifications: true,
  offerNotifications: true,
  reportNotifications: false,
  notificationTime: '09:00'
}

export default function NotificationSettingsPage() {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(defaultNotificationSettings);
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
        
        const notificationData: any = {};
        settingsData.forEach((setting: any) => {
          if (setting.key.startsWith('notification.')) {
            const key = setting.key.replace('notification.', '');
            if (key === 'emailNotifications' || key === 'smsNotifications' || 
                key === 'reminderNotifications' || key === 'offerNotifications' || 
                key === 'reportNotifications') {
              notificationData[key] = setting.value === 'true';
            } else {
              notificationData[key] = setting.value;
            }
          }
        });

        if (Object.keys(notificationData).length > 0) {
          setSettings(prev => ({ ...prev, ...notificationData }));
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
      const defaultValue = defaultNotificationSettings[key as keyof typeof defaultNotificationSettings];
      return currentValue !== defaultValue;
    });
    setHasChanges(hasAnyChanges);
  }, [settings]);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsData = [
        { key: 'notification.emailNotifications', value: settings.emailNotifications.toString() },
        { key: 'notification.smsNotifications', value: settings.smsNotifications.toString() },
        { key: 'notification.reminderNotifications', value: settings.reminderNotifications.toString() },
        { key: 'notification.offerNotifications', value: settings.offerNotifications.toString() },
        { key: 'notification.reportNotifications', value: settings.reportNotifications.toString() },
        { key: 'notification.notificationTime', value: settings.notificationTime }
      ];

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsData })
      });

      if (response.ok) {
        addToast({ message: 'Bildirim ayarları başarıyla kaydedildi', type: 'success' });
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
    setSettings(defaultNotificationSettings);
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
            <h1 className="text-2xl font-bold text-gray-800">Bildirim Ayarları</h1>
            <p className="text-gray-600 text-sm">E-posta ve SMS bildirim tercihleri</p>
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

      {/* Bildirim Ayarları */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaBell className="text-purple-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Bildirim Tercihleri</h3>
        </div>
        
        <div className="space-y-6">
          {/* E-posta Bildirimleri */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-800 mb-4">E-posta Bildirimleri</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">E-posta Bildirimleri</label>
                  <p className="text-xs text-gray-500">Genel e-posta bildirimlerini etkinleştir</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Hatırlatma Bildirimleri</label>
                  <p className="text-xs text-gray-500">Hasta hatırlatmaları için e-posta gönder</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.reminderNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, reminderNotifications: e.target.checked }))}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Teklif Bildirimleri</label>
                  <p className="text-xs text-gray-500">Yeni teklif oluşturulduğunda bildirim gönder</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.offerNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, offerNotifications: e.target.checked }))}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Rapor Bildirimleri</label>
                  <p className="text-xs text-gray-500">Aylık raporlar için e-posta gönder</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.reportNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, reportNotifications: e.target.checked }))}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* SMS Bildirimleri */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-800 mb-4">SMS Bildirimleri</h4>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">SMS Bildirimleri</label>
                <p className="text-xs text-gray-500">SMS ile bildirim gönder (ücretli)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Bildirim Zamanı */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-4">Bildirim Zamanı</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Günlük Bildirim Saati
              </label>
              <input 
                type="time"
                value={settings.notificationTime}
                onChange={(e) => setSettings(prev => ({ ...prev, notificationTime: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Günlük bildirimlerin gönderileceği saat
              </p>
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
              Kaydedilmemiş değişiklikleriniz var. Değişiklikleri kaydetmek için &quot;Kaydet&quot; butonuna tıklayın.
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 