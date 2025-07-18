'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Package {
  id: string;
  name: string;
  features: string;
  price: number;
  currency: string;
  duration: number;
  isActive: boolean;
  createdAt: string;
  clinics: Array<{
    id: string;
    name: string;
    subdomain: string;
  }>;
  _count: {
    clinics: number;
  };
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/packages');
      const data = await response.json();
      setPackages(data.packages);
    } catch (error) {
      console.error('Paketler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseFeatures = (featuresString: string): string[] => {
    try {
      return JSON.parse(featuresString);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paket Yönetimi</h1>
          <p className="text-gray-600 mt-1">Sistemdeki tüm özellik paketlerini yönetin</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ Yeni Paket
        </Link>
      </div>

      {/* Paket Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Henüz paket bulunmuyor</p>
            <Link
              href="/admin/packages/new"
              className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
            >
              İlk paketi oluşturun
            </Link>
          </div>
        ) : (
          packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {pkg.price} {pkg.currency}
                  </p>
                  <p className="text-sm text-gray-500">{pkg.duration} gün</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  pkg.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pkg.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              {/* Özellikler */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Özellikler:</h4>
                <div className="space-y-1">
                  {parseFeatures(pkg.features).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Kullanım */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{pkg._count.clinics} klinik kullanıyor</span>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/packages/${pkg.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Görüntüle
                    </Link>
                    <Link
                      href={`/admin/packages/${pkg.id}/edit`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Düzenle
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 