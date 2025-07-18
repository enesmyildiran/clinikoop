'use client';

import { useState, useEffect } from 'react';
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
  createdAt: string;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }>;
  packages: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
  }>;
  _count: {
    patients: number;
    offers: number;
  };
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/clinics');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // API'den gelen veri yapısını kontrol et
      if (Array.isArray(data)) {
        setClinics(data);
      } else if (data && Array.isArray(data.clinics)) {
        setClinics(data.clinics);
      } else {
        setClinics([]);
      }
    } catch (error) {
      console.error('Klinikler yüklenirken hata:', error);
      setError('Klinikler yüklenirken bir hata oluştu');
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Klinik Yönetimi</h1>
            <p className="text-gray-600 mt-1">Sistemdeki tüm klinikleri yönetin</p>
          </div>
          <Link
            href="/admin/clinics/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Yeni Klinik
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchClinics}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klinik Yönetimi</h1>
          <p className="text-gray-600 mt-1">Sistemdeki tüm klinikleri yönetin</p>
        </div>
        <Link
          href="/admin/clinics/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ Yeni Klinik
        </Link>
      </div>

      {/* Klinik Listesi */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Klinikler</h2>
          
          {!clinics || clinics.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz klinik bulunmuyor</p>
              <Link
                href="/admin/clinics/new"
                className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
              >
                İlk kliniği oluşturun
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Klinik
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subdomain
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcılar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hastalar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teklifler
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clinics.map((clinic) => (
                    <tr key={clinic.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {clinic.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {clinic.domain || `${clinic.subdomain}.clinikoop.com`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {clinic.subdomain}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {clinic.users?.length || 0} / {clinic.maxUsers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {clinic._count?.patients || 0} / {clinic.maxPatients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {clinic._count?.offers || 0} / {clinic.maxOffers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          clinic.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {clinic.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/clinics/${clinic.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Görüntüle
                          </Link>
                          <Link
                            href={`/admin/clinics/${clinic.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Düzenle
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 