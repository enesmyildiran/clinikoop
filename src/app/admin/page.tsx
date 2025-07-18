'use client';

import Link from 'next/link';
import { FaHospital, FaPlus, FaUsers, FaChartBar } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface Clinic {
  id: string;
  name: string;
  subdomain: string;
  isActive: boolean;
  maxUsers: number;
  maxPatients: number;
  maxOffers: number;
  users: Array<{ id: string; name: string; email: string; role: string; isActive: boolean }>;
  _count: {
    patients: number;
    offers: number;
  };
}

export default function ClinicManagementPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await fetch('/api/admin/clinics');
        if (!response.ok) {
          throw new Error('Klinikler yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setClinics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaHospital className="text-blue-600" /> Klinik Yönetimi
        </h1>
        <Link href="/admin/clinics/new" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <FaPlus /> Yeni Klinik Ekle
        </Link>
      </div>

      {/* Klinik Listesi */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Klinikler</h2>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Klinikler yükleniyor...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Klinik Adı</th>
                  <th className="px-4 py-2 text-left">Subdomain</th>
                  <th className="px-4 py-2 text-left">Durum</th>
                  <th className="px-4 py-2 text-left">Kullanıcı Sayısı</th>
                  <th className="px-4 py-2 text-left">Hasta Sayısı</th>
                  <th className="px-4 py-2 text-left">Teklif Sayısı</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {clinics.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Henüz klinik oluşturulmamış
                    </td>
                  </tr>
                ) : (
                  clinics.map((clinic) => (
                    <tr key={clinic.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{clinic.name}</td>
                      <td className="px-4 py-2 text-gray-600">{clinic.subdomain}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          clinic.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {clinic.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-4 py-2">{clinic.users.length}</td>
                      <td className="px-4 py-2">{clinic._count.patients}</td>
                      <td className="px-4 py-2">{clinic._count.offers}</td>
                      <td className="px-4 py-2 text-right">
                        <Link href={`/admin/clinics/${clinic.id}`} className="text-blue-600 hover:underline font-medium">Detay</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 