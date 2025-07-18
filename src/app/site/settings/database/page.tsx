'use client'

import Link from 'next/link'
import { FaArrowLeft, FaDatabase, FaDownload, FaUpload, FaTrash, FaCog } from 'react-icons/fa'

export default function DatabaseSettingsPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/site/settings"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm">Ayarlara Dön</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Veritabanı Yönetimi</h1>
            <p className="text-gray-600 text-sm">Veritabanı yedekleme ve bakım işlemleri</p>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <div className="mb-6">
          <FaDatabase className="text-6xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Yakında Gelecek</h2>
          <p className="text-gray-600 mb-6">
            Veritabanı yönetimi özellikleri yakında eklenecek. Bu sayfada şu özellikler olacak:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-blue-50 rounded-lg">
            <FaDownload className="text-2xl text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800 mb-1">Yedekleme</h3>
            <p className="text-sm text-gray-600">Veritabanı yedekleme işlemleri</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <FaUpload className="text-2xl text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800 mb-1">Geri Yükleme</h3>
            <p className="text-sm text-gray-600">Yedekten geri yükleme</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <FaCog className="text-2xl text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800 mb-1">Bakım</h3>
            <p className="text-sm text-gray-600">Veritabanı optimizasyonu</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/site/settings"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ayarlara Dön
          </Link>
          <Link
            href="/site/dashboard"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Dashboard&apos;a Git
          </Link>
        </div>
      </div>
    </div>
  )
} 