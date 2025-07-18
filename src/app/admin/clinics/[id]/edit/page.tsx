'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ClinicFormData {
  name: string;
  subdomain: string;
  domain?: string;
  maxUsers: number;
  maxPatients: number;
  maxOffers: number;
  isActive: boolean;
}

interface Clinic {
  id: string;
  name: string;
  subdomain: string;
  domain?: string;
  isActive: boolean;
  maxUsers: number;
  maxPatients: number;
  maxOffers: number;
  createdAt: string;
  updatedAt: string;
}

export default function EditClinicPage() {
  const router = useRouter();
  const params = useParams();
  const clinicId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [formData, setFormData] = useState<ClinicFormData>({
    name: '',
    subdomain: '',
    domain: '',
    maxUsers: 5,
    maxPatients: 100,
    maxOffers: 500,
    isActive: true,
  });

  // Klinik verilerini yükle
  useEffect(() => {
    if (clinicId) {
      fetchClinic();
    }
  }, [clinicId]);

  const fetchClinic = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/clinics/${clinicId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Klinik bulunamadı');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const clinicData = await response.json();
      setClinic(clinicData);
      setFormData({
        name: clinicData.name,
        subdomain: clinicData.subdomain,
        domain: clinicData.domain || '',
        maxUsers: clinicData.maxUsers,
        maxPatients: clinicData.maxPatients,
        maxOffers: clinicData.maxOffers,
        isActive: clinicData.isActive,
      });
    } catch (error) {
      console.error('Klinik yükleme hatası:', error);
      setError(error instanceof Error ? error.message : 'Klinik yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/clinics/${clinicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Klinik güncellenirken bir hata oluştu');
      }

      const result = await response.json();
      router.push('/admin/clinics');
    } catch (error) {
      console.error('Klinik güncelleme hatası:', error);
      setError(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (error && !clinic) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Klinik Düzenle</h1>
            <p className="text-gray-600 mt-1">Klinik bilgilerini güncelleyin</p>
          </div>
          <Link
            href="/admin/clinics"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Klinik Listesine Dön
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Link
              href="/admin/clinics"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Klinik Listesine Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klinik Düzenle</h1>
          <p className="text-gray-600 mt-1">{clinic?.name} kliniğinin bilgilerini güncelleyin</p>
        </div>
        <Link
          href="/admin/clinics"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Klinik Listesine Dön
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Temel Bilgiler */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Klinik Adı *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Örn: Diş Hekimi Ahmet Yılmaz"
                />
              </div>

              <div>
                <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-2">
                  Subdomain *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="subdomain"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ahmetyilmaz"
                  />
                  <span className="inline-flex items-center px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg text-gray-500 text-sm">
                    .clinikoop.com
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Sadece harf, rakam ve tire kullanabilirsiniz
                </p>
              </div>
            </div>
          </div>

          {/* Özel Domain (Opsiyonel) */}
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
              Özel Domain (Opsiyonel)
            </label>
            <input
              type="text"
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Örn: ahmetyilmaz.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Eğer özel domain kullanacaksanız, DNS ayarlarını yapmanız gerekir
            </p>
          </div>

          {/* Limitler */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sistem Limitleri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="maxUsers" className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimum Kullanıcı Sayısı
                </label>
                <input
                  type="number"
                  id="maxUsers"
                  name="maxUsers"
                  value={formData.maxUsers}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Klinik içinde oluşturulabilecek maksimum kullanıcı sayısı
                </p>
              </div>

              <div>
                <label htmlFor="maxPatients" className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimum Hasta Sayısı
                </label>
                <input
                  type="number"
                  id="maxPatients"
                  name="maxPatients"
                  value={formData.maxPatients}
                  onChange={handleInputChange}
                  min="1"
                  max="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Klinik içinde oluşturulabilecek maksimum hasta sayısı
                </p>
              </div>

              <div>
                <label htmlFor="maxOffers" className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimum Teklif Sayısı
                </label>
                <input
                  type="number"
                  id="maxOffers"
                  name="maxOffers"
                  value={formData.maxOffers}
                  onChange={handleInputChange}
                  min="1"
                  max="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Klinik içinde oluşturulabilecek maksimum teklif sayısı
                </p>
              </div>
            </div>
          </div>

          {/* Durum */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Klinik aktif olsun
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Pasif klinikler sisteme erişemez
            </p>
          </div>

          {/* Klinik Bilgileri */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Klinik Bilgileri</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Oluşturulma Tarihi:</span>
                <span className="ml-2 text-gray-900">
                  {clinic?.createdAt ? new Date(clinic.createdAt).toLocaleDateString('tr-TR') : '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Son Güncelleme:</span>
                <span className="ml-2 text-gray-900">
                  {clinic?.updatedAt ? new Date(clinic.updatedAt).toLocaleDateString('tr-TR') : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/admin/clinics"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Güncelleniyor...' : 'Klinik Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 