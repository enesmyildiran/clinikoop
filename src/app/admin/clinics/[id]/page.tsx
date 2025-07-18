'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Clinic {
  id: string;
  name: string;
  subdomain: string;
  domain?: string;
  isActive: boolean;
  maxUsers: number;
  maxPatients: number;
  maxOffers: number;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionStatus: string;
  packageId?: string;
  package?: {
    id: string;
    name: string;
    price: number;
    currency: string;
    duration: number;
  };
  createdAt: string;
  updatedAt: string;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }>;
  _count: {
    patients: number;
    offers: number;
  };
}

export default function ClinicDetailPage() {
  const params = useParams();
  const clinicId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);

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
    } catch (error) {
      console.error('Klinik yükleme hatası:', error);
      setError(error instanceof Error ? error.message : 'Klinik yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'TRIAL': return 'bg-blue-100 text-blue-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionStatusText = (status: string) => {
    switch (status) {
      case 'TRIAL': return 'Deneme';
      case 'ACTIVE': return 'Aktif';
      case 'EXPIRED': return 'Süresi Dolmuş';
      case 'CANCELLED': return 'İptal Edilmiş';
      default: return 'Bilinmiyor';
    }
  };

  const isSubscriptionExpired = () => {
    if (!clinic?.subscriptionEndDate) return false;
    return new Date(clinic.subscriptionEndDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Klinik Detayı</h1>
            <p className="text-gray-600 mt-1">Klinik bilgilerini görüntüleyin</p>
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
          <h1 className="text-2xl font-bold text-gray-900">{clinic.name}</h1>
          <p className="text-gray-600 mt-1">Klinik detayları ve istatistikler</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/clinics"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Klinik Listesine Dön
          </Link>
          <Link
            href={`/admin/clinics/${clinic.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Düzenle
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Temel Bilgiler */}
        <div className="lg:col-span-2 space-y-6">
          {/* Klinik Bilgileri */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Klinik Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Klinik Adı</label>
                <p className="text-sm text-gray-900 mt-1">{clinic.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Subdomain</label>
                <p className="text-sm text-gray-900 mt-1">
                  {clinic.subdomain}.clinikoop.com
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Özel Domain</label>
                <p className="text-sm text-gray-900 mt-1">
                  {clinic.domain || 'Belirtilmemiş'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Durum</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                  clinic.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {clinic.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>
          </div>

          {/* Sistem Limitleri */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sistem Limitleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{clinic._count.users || 0}</div>
                <div className="text-sm text-gray-500">Kullanıcı</div>
                <div className="text-xs text-gray-400">Limit: {clinic.maxUsers}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{clinic._count.patients}</div>
                <div className="text-sm text-gray-500">Hasta</div>
                <div className="text-xs text-gray-400">Limit: {clinic.maxPatients}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{clinic._count.offers}</div>
                <div className="text-sm text-gray-500">Teklif</div>
                <div className="text-xs text-gray-400">Limit: {clinic.maxOffers}</div>
              </div>
            </div>
          </div>

          {/* Kullanıcılar */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcılar</h2>
            {clinic.users.length === 0 ? (
              <p className="text-gray-500">Henüz kullanıcı bulunmuyor</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kullanıcı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clinic.users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Yan Panel */}
        <div className="space-y-6">
          {/* Abonelik Bilgileri */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Abonelik Bilgileri</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Durum</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getSubscriptionStatusColor(clinic.subscriptionStatus)}`}>
                  {getSubscriptionStatusText(clinic.subscriptionStatus)}
                </span>
                {isSubscriptionExpired() && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Abonelik süresi dolmuş!</p>
                )}
              </div>
              
              {clinic.package && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Paket</label>
                  <p className="text-sm text-gray-900 mt-1">{clinic.package.name}</p>
                  <p className="text-xs text-gray-500">{clinic.package.price} {clinic.package.currency} / {clinic.package.duration} gün</p>
                </div>
              )}
              
              {clinic.subscriptionStartDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Başlangıç Tarihi</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(clinic.subscriptionStartDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              )}
              
              {clinic.subscriptionEndDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Bitiş Tarihi</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(clinic.subscriptionEndDate).toLocaleDateString('tr-TR')}
                  </p>
                  {isSubscriptionExpired() && (
                    <p className="text-xs text-red-600 mt-1">
                      {Math.ceil((new Date().getTime() - new Date(clinic.subscriptionEndDate).getTime()) / (1000 * 60 * 60 * 24))} gün önce dolmuş
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sistem Bilgileri */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sistem Bilgileri</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Oluşturulma Tarihi</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(clinic.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Son Güncelleme</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(clinic.updatedAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Klinik ID</label>
                <p className="text-sm text-gray-900 mt-1 font-mono text-xs">{clinic.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 