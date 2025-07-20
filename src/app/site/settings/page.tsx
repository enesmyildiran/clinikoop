"use client"

import { useState } from 'react'
import { FaCog, FaUser, FaShieldAlt, FaBell, FaPalette, FaDatabase, FaGlobe, FaMoneyBillWave, FaTags, FaEye } from 'react-icons/fa'
import Link from 'next/link'
import { FaFilePdf } from 'react-icons/fa'
import { PageContainer } from '@/components/ui/PageContainer'

const settingCategories = [
  {
    id: 'general',
    title: 'Genel Ayarlar',
    icon: <FaCog className="text-blue-600" />,
    description: 'Sistem genel ayarları ve temel yapılandırma',
    path: '/settings/general'
  },
  {
    id: 'pdf',
    title: 'PDF Ayarları',
    icon: <FaFilePdf className="text-red-600" />,
    description: 'PDF şablonları ve teklif ayarları',
    path: '/settings/pdf'
  },
  {
    id: 'currency',
    title: 'Para Birimi ve Döviz',
    icon: <FaMoneyBillWave className="text-green-600" />,
    description: 'Varsayılan para birimi ve döviz kuru ayarları',
    path: '/settings/currency'
  },
  {
    id: 'appearance',
    title: 'Görünüm',
    icon: <FaPalette className="text-purple-600" />,
    description: 'Tema, renkler ve görsel ayarlar',
    path: '/settings/appearance'
  },
  {
    id: 'notifications',
    title: 'Bildirimler',
    icon: <FaBell className="text-orange-600" />,
    description: 'E-posta ve sistem bildirimleri',
    path: '/settings/notifications'
  },
  {
    id: 'security',
    title: 'Güvenlik',
    icon: <FaShieldAlt className="text-red-600" />,
    description: 'Şifre politikaları ve güvenlik ayarları',
    path: '/settings/security'
  },
  {
    id: 'database',
    title: 'Veritabanı',
    icon: <FaDatabase className="text-green-600" />,
    description: 'Veritabanı yedekleme ve bakım',
    path: '/settings/database'
  },
  {
    id: 'language',
    title: 'Dil ve Bölge',
    icon: <FaGlobe className="text-indigo-600" />,
    description: 'Dil, saat dilimi ve tarih formatı',
    path: '/settings/language'
  },
  {
    id: 'statuses',
    title: 'Teklif Durumları',
    icon: <FaTags className="text-emerald-600" />,
    description: 'Teklif durumları ve pipeline yönetimi',
    path: '/settings/statuses'
  },
  {
    id: 'referral-sources',
    title: 'Hasta Kaynakları',
    icon: <FaEye className="text-cyan-600" />,
    description: 'Hasta kaynakları ve referans yönetimi',
    path: '/settings/referral-sources'
  }
]

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Sistem Ayarları</h1>
        <p className="text-gray-600 mt-2">Sistem ayarlarını yönetmek için aşağıdaki kategorilerden birini seçin</p>
      </div>

      {/* Ayar Kategorileri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingCategories.map((category) => (
          <Link 
            key={category.id} 
            href={category.path}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {category.title}
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 hover:text-blue-800 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                Düzenle →
              </span>
              <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Hızlı Erişim */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/settings/pdf"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
          >
            <FaFilePdf className="text-red-600" />
            <span className="text-sm font-medium">PDF Ayarları</span>
          </Link>
          <Link 
            href="/settings/currency"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
          >
            <FaMoneyBillWave className="text-green-600" />
            <span className="text-sm font-medium">Para Birimi</span>
          </Link>
          <Link 
            href="/settings/general"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
          >
            <FaCog className="text-blue-600" />
            <span className="text-sm font-medium">Genel Ayarlar</span>
          </Link>
        </div>
      </div>
    </PageContainer>
  )
} 