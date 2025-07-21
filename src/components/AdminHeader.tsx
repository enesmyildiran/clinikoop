'use client'

import { useState } from 'react'
import { FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa'
import { useToast } from '@/components/ui/Toast'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface AdminHeaderProps {
  className?: string
}

export default function AdminHeader({ className = '' }: AdminHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { addToast } = useToast()

  // Mock data - gerçek uygulamada auth'dan gelecek
  const userInitial = 'A' // Kullanıcının baş harfi
  const userName = 'Admin User' // Kullanıcı adı

  const handleLogout = async () => {
    addToast({
      message: 'Çıkış yapılıyor...',
      type: 'info'
    })
    
    try {
      await signOut({ 
        callbackUrl: '/admin-login',
        redirect: true 
      })
    } catch (error) {
      addToast({
        message: 'Çıkış yapılırken hata oluştu',
        type: 'error'
      })
    }
  }

  return (
    <header className={`sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Sol taraf - Admin Paneli Başlığı */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🦷</span>
            <h1 className="text-xl font-bold text-gray-900">Clinikoop</h1>
          </div>
          <span className="text-sm text-gray-500">|</span>
          <span className="text-sm font-medium text-blue-600">Süper Admin Paneli</span>
        </div>

        {/* Sağ taraf - Profil */}
        <div className="flex items-center gap-4">
          {/* Profil Menüsü */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{userInitial}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{userName}</span>
              <FaChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Profil Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Süper Admin</p>
                </div>
                
                <div className="py-1">
                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FaCog className="w-4 h-4 mr-3" />
                    Ayarlar
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-3" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 