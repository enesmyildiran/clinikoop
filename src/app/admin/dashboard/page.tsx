'use client'

import { useAuth } from '@/hooks/useAuth'
import { FaCode, FaUser, FaShieldAlt, FaInfoCircle, FaHospital, FaUsers, FaFileAlt, FaChartBar, FaCog, FaHeadset, FaDatabase, FaBug } from 'react-icons/fa'
import Link from 'next/link'

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

  const adminModules = [
    {
      title: 'Klinik Yönetimi',
      description: 'Klinikleri görüntüle, düzenle ve yönet',
      icon: FaHospital,
      href: '/admin/clinics',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Kullanıcı Yönetimi',
      description: 'Sistem kullanıcılarını yönet',
      icon: FaUsers,
      href: '/admin/users',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Sistem Ayarları',
      description: 'Genel sistem ayarlarını yapılandır',
      icon: FaCog,
      href: '/admin/settings',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Modül Ayarları',
      description: 'Sistem modüllerini yapılandır',
      icon: FaCog,
      href: '/admin/module-settings',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Destek Sistemi',
      description: 'Destek taleplerini yönet',
      icon: FaHeadset,
      href: '/admin/support',
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      title: 'Yedekleme',
      description: 'Sistem yedeklerini yönet',
      icon: FaDatabase,
      href: '/admin/backup',
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      title: 'Loglar',
      description: 'Sistem loglarını görüntüle',
      icon: FaBug,
      href: '/admin/logs',
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700'
    },
    {
      title: 'Analizler',
      description: 'Sistem analizlerini görüntüle',
      icon: FaChartBar,
      href: '/admin/analytics',
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700'
    }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Süper Admin Paneli</h1>
        <p className="text-gray-600">Hoş geldiniz, {user?.name || 'Kullanıcı'}!</p>
      </div>

      {/* Geliştirme Modu Bilgileri */}
      {isDevelopment && (
        <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FaCode className="text-yellow-600" size={20} />
            <h2 className="text-lg font-semibold text-yellow-800">Geliştirme Modu Aktif</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm">
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

            <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm">
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

            <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm">
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

      {/* Admin Modülleri */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Yönetim Modülleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adminModules.map((module, index) => {
            const IconComponent = module.icon
            return (
              <Link
                key={index}
                href={module.href}
                className={`${module.bgColor} border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 group`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${module.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </h3>
                    <p className={`text-sm ${module.textColor}`}>
                      {module.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Klinik</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaHospital className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaUsers className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Açık Destek</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaHeadset className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sistem Durumu</p>
              <p className="text-2xl font-bold text-green-600">Aktif</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaShieldAlt className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 