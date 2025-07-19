'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSession } from 'next-auth/react';
import { FaUser, FaShieldAlt, FaHospital, FaCog } from 'react-icons/fa';

export default function TestAuthPage() {
  const { data: session } = useSession();
  const { user, clinic, isSuperAdmin, isDevelopment, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FaShieldAlt className="text-blue-600" />
            Kullanıcı Erişim Test Sayfası
          </h1>

          {/* Geliştirme Modu Uyarısı */}
          {isDevelopment && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <FaCog className="text-yellow-600" />
                <span className="font-semibold text-yellow-800">Geliştirme Modu Aktif</span>
              </div>
              <p className="text-yellow-700 mt-2">
                Bu sayfa geliştirme modunda çalışıyor. Canlı ortamda gerçek NextAuth sistemi devreye girecek.
              </p>
            </div>
          )}

          {/* Hata Durumu */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-red-600" />
                <span className="font-semibold text-red-800">Hata</span>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
            </div>
          )}

          {/* Session Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                NextAuth Session
              </h2>
              <div className="space-y-2">
                <p><strong>Durum:</strong> {session ? 'Aktif' : 'Pasif'}</p>
                {session?.user && (
                  <>
                    <p><strong>Email:</strong> {session.user.email}</p>
                    <p><strong>Ad:</strong> {session.user.name}</p>
                    <p><strong>Rol:</strong> {(session.user as any)?.role || 'Belirtilmemiş'}</p>
                    <p><strong>Süper Admin:</strong> {(session.user as any)?.isSuperAdmin ? 'Evet' : 'Hayır'}</p>
                    <p><strong>Klinik ID:</strong> {(session.user as any)?.clinicId || 'Yok'}</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-2">
                <FaHospital className="text-green-600" />
                useAuth Hook
              </h2>
              <div className="space-y-2">
                <p><strong>Kullanıcı:</strong> {user ? 'Mevcut' : 'Yok'}</p>
                <p><strong>Klinik:</strong> {clinic ? clinic.name : 'Yok'}</p>
                <p><strong>Süper Admin:</strong> {isSuperAdmin ? 'Evet' : 'Hayır'}</p>
                <p><strong>Geliştirme Modu:</strong> {isDevelopment ? 'Evet' : 'Hayır'}</p>
              </div>
            </div>
          </div>

          {/* Detaylı Kullanıcı Bilgileri */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Detaylı Kullanıcı Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Ad:</strong> {user.name}</p>
                  <p><strong>Rol:</strong> {user.role}</p>
                </div>
                <div>
                  <p><strong>Aktif:</strong> {user.isActive ? 'Evet' : 'Hayır'}</p>
                  {user.createdAt && (
                    <p><strong>Oluşturulma:</strong> {new Date(user.createdAt).toLocaleDateString('tr-TR')}</p>
                  )}
                  {user.updatedAt && (
                    <p><strong>Güncellenme:</strong> {new Date(user.updatedAt).toLocaleDateString('tr-TR')}</p>
                  )}
                  {user.permissions && (
                    <p><strong>İzinler:</strong> {user.permissions}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Klinik Bilgileri */}
          {clinic && (
            <div className="bg-purple-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-purple-900 mb-4">Klinik Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>ID:</strong> {clinic.id}</p>
                  <p><strong>Ad:</strong> {clinic.name}</p>
                  <p><strong>Subdomain:</strong> {clinic.subdomain}</p>
                  <p><strong>Domain:</strong> {clinic.domain || 'Yok'}</p>
                </div>
                <div>
                  <p><strong>Aktif:</strong> {clinic.isActive ? 'Evet' : 'Hayır'}</p>
                  {clinic.maxUsers && <p><strong>Max Kullanıcı:</strong> {clinic.maxUsers}</p>}
                  {clinic.maxPatients && <p><strong>Max Hasta:</strong> {clinic.maxPatients}</p>}
                  {clinic.maxOffers && <p><strong>Max Teklif:</strong> {clinic.maxOffers}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Erişim Testleri */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Erişim Testleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-2">Süper Admin Paneli</h3>
                <p className="text-sm text-gray-600 mb-3">Tüm sistemlere erişim</p>
                <a 
                  href="/admin" 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Test Et
                </a>
              </div>
              
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-2">Klinik Dashboard</h3>
                <p className="text-sm text-gray-600 mb-3">Klinik yönetimi</p>
                <a 
                  href="/site/dashboard" 
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                >
                  Test Et
                </a>
              </div>
              
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-2">Yetkisiz Erişim</h3>
                <p className="text-sm text-gray-600 mb-3">Erişim reddedildi sayfası</p>
                <a 
                  href="/unauthorized" 
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                >
                  Test Et
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 