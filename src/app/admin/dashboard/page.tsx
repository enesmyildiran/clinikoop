'use client'

import { useAuth } from '@/hooks/useAuth'
import { FaCode, FaUser, FaShieldAlt, FaInfoCircle } from 'react-icons/fa'

export default function DashboardPage() {
  const { user, clinic, isSuperAdmin, isDevelopment, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Hoş geldiniz, {user?.name || 'Kullanıcı'}!</p>
      </div>

      {/* Geliştirme Modu Bilgileri */}
      {isDevelopment && (
        <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <FaCode className="text-yellow-600" size={20} />
            <h2 className="text-lg font-semibold text-yellow-800">Geliştirme Modu Aktif</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-blue-600" size={16} />
                <span className="font-medium text-gray-700">Kullanıcı Bilgileri</span>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">ID:</span> {user?.id || 'N/A'}</p>
                <p><span className="font-medium">E-posta:</span> {user?.email || 'N/A'}</p>
                <p><span className="font-medium">Rol:</span> {user?.role || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <FaShieldAlt className="text-green-600" size={16} />
                <span className="font-medium text-gray-700">Yetki Bilgileri</span>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Süper Admin:</span> {isSuperAdmin ? 'Evet' : 'Hayır'}</p>
                <p><span className="font-medium">Klinik ID:</span> {user?.clinicId || 'N/A'}</p>
                <p><span className="font-medium">Klinik:</span> {clinic?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <FaInfoCircle className="text-purple-600" size={16} />
                <span className="font-medium text-gray-700">Auth Bilgileri</span>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Kullanıcı:</span> {user ? 'Aktif' : 'Pasif'}</p>
                <p><span className="font-medium">Klinik:</span> {clinic ? 'Yüklendi' : 'Yüklenmedi'}</p>
                <p><span className="font-medium">Mock Auth:</span> {isDevelopment ? 'Aktif' : 'Pasif'}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Not:</strong> Bu geliştirme modunda otomatik olarak süper admin yetkileriyle giriş yapılmıştır. 
              Canlıya alındığında gerçek NextAuth sistemi devreye girecektir.
            </p>
          </div>
        </div>
      )}

      {/* Normal Dashboard İçeriği */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Hasta</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Teklifler</p>
              <p className="text-2xl font-bold text-gray-900">567</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bugünkü Hatırlatmalar</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aylık Gelir</p>
              <p className="text-2xl font-bold text-gray-900">₺45,678</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Son Aktiviteler */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Yeni hasta kaydı oluşturuldu</p>
                <p className="text-xs text-gray-500">2 saat önce</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Teklif onaylandı</p>
                <p className="text-xs text-gray-500">4 saat önce</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Hatırlatma oluşturuldu</p>
                <p className="text-xs text-gray-500">6 saat önce</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 