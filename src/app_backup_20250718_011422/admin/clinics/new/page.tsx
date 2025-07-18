'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewClinicPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    domain: '',
    maxUsers: 5,
    maxPatients: 100,
    maxOffers: 500,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/clinics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Klinik başarıyla oluşturuldu!');
        router.push('/admin/clinics');
      } else {
        alert(data.error || 'Klinik oluşturulamadı');
      }
    } catch (error) {
      console.error('Klinik oluşturulurken hata:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxUsers' || name === 'maxPatients' || name === 'maxOffers' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Klinik Oluştur</h1>
        <p className="text-gray-600 mt-1">Sisteme yeni bir klinik hesabı ekleyin</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Temel Bilgiler */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Klinik Adı *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Ahmet Yılmaz Diş Kliniği"
                />
              </div>

              <div>
                <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-1">
                  Subdomain *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="subdomain"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ahmetyilmaz"
                  />
                  <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600 text-sm">
                    .clinikoop.com
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  URL: {formData.subdomain ? `${formData.subdomain}.clinikoop.com` : 'subdomain.clinikoop.com'}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                Özel Domain (Opsiyonel)
              </label>
              <input
                type="text"
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Örn: ahmetyilmaz.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Özel domain varsa, subdomain yerine kullanılır
              </p>
            </div>
          </div>

          {/* Limitler */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sistem Limitleri</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="maxUsers" className="block text-sm font-medium text-gray-700 mb-1">
                  Maksimum Kullanıcı
                </label>
                <input
                  type="number"
                  id="maxUsers"
                  name="maxUsers"
                  value={formData.maxUsers}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="maxPatients" className="block text-sm font-medium text-gray-700 mb-1">
                  Maksimum Hasta
                </label>
                <input
                  type="number"
                  id="maxPatients"
                  name="maxPatients"
                  value={formData.maxPatients}
                  onChange={handleChange}
                  min="1"
                  max="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="maxOffers" className="block text-sm font-medium text-gray-700 mb-1">
                  Maksimum Teklif
                </label>
                <input
                  type="number"
                  id="maxOffers"
                  name="maxOffers"
                  value={formData.maxOffers}
                  onChange={handleChange}
                  min="1"
                  max="50000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

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
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Oluşturuluyor...' : 'Klinik Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 