'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AVAILABLE_FEATURES = [
  'basic_patient_management',
  'advanced_patient_management', 
  'offer_creation',
  'pdf_generation',
  'performance_analytics',
  'advanced_reports',
  'custom_branding',
  'api_access',
  'priority_support',
  'multi_user',
  'appointment_scheduling',
  'reminder_system',
  'referral_tracking',
  'insurance_integration',
];

const FEATURE_LABELS: Record<string, string> = {
  basic_patient_management: 'Temel Hasta Yönetimi',
  advanced_patient_management: 'Gelişmiş Hasta Yönetimi',
  offer_creation: 'Teklif Oluşturma',
  pdf_generation: 'PDF Üretimi',
  performance_analytics: 'Performans Analizi',
  advanced_reports: 'Gelişmiş Raporlar',
  custom_branding: 'Özel Markalama',
  api_access: 'API Erişimi',
  priority_support: 'Öncelikli Destek',
  multi_user: 'Çoklu Kullanıcı',
  appointment_scheduling: 'Randevu Planlama',
  reminder_system: 'Hatırlatma Sistemi',
  referral_tracking: 'Referans Takibi',
  insurance_integration: 'Sigorta Entegrasyonu',
};

export default function NewPackagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'TRY',
    duration: '30',
    features: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Paket başarıyla oluşturuldu!');
        router.push('/admin/packages');
      } else {
        alert(data.error || 'Paket oluşturulamadı');
      }
    } catch (error) {
      console.error('Paket oluşturulurken hata:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Paket Oluştur</h1>
        <p className="text-gray-600 mt-1">Sisteme yeni bir özellik paketi ekleyin</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Temel Bilgiler */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Paket Adı *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Basic, Professional, Enterprise"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Para Birimi
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Fiyat *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Süre (Gün) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                />
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Özellikler</h3>
            <p className="text-sm text-gray-600 mb-4">
              Bu pakete dahil edilecek özellikleri seçin:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AVAILABLE_FEATURES.map((feature) => (
                <label key={feature} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {FEATURE_LABELS[feature]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Seçili Özellikler Özeti */}
          {formData.features.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Seçili Özellikler ({formData.features.length}):
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {FEATURE_LABELS[feature]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Butonlar */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || formData.features.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Oluşturuluyor...' : 'Paket Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 