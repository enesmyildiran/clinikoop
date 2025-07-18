'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  FaHome, 
  FaUsers, 
  FaFileAlt, 
  FaCog, 
  FaChartBar,
  FaArrowLeft,
  FaExclamationTriangle,
  FaRocket,
  FaLightbulb
} from 'react-icons/fa'

const quickLinks = [
  {
    title: 'Dashboard',
    description: 'Ana kontrol paneli',
    icon: <FaChartBar className="text-blue-600" />,
    href: '/site/dashboard',
    color: 'bg-blue-50 hover:bg-blue-100'
  },
  {
    title: 'Hastalar',
    description: 'Hasta yönetimi',
    icon: <FaUsers className="text-green-600" />,
    href: '/site/patients',
    color: 'bg-green-50 hover:bg-green-100'
  },
  {
    title: 'Teklifler',
    description: 'Teklif yönetimi',
    icon: <FaFileAlt className="text-purple-600" />,
    href: '/site/offers',
    color: 'bg-purple-50 hover:bg-purple-100'
  },
  {
    title: 'Ayarlar',
    description: 'Sistem ayarları',
    icon: <FaCog className="text-orange-600" />,
    href: '/site/settings',
    color: 'bg-orange-50 hover:bg-orange-100'
  }
]

export default function NotFound() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animasyonlu arka plan elementleri */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Ana İçerik */}
        <div className="text-center max-w-4xl mx-auto">
          {/* 404 Animasyonu */}
          <div className="mb-8">
            <div className="relative">
              <div className="text-9xl font-bold text-gray-300 select-none animate-pulse">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaExclamationTriangle className="text-6xl text-red-500 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Başlık ve Açıklama */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Sayfa Bulunamadı
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Aradığınız sayfa mevcut değil, taşınmış veya silinmiş olabilir. 
              Aşağıdaki seçeneklerden birini kullanarak devam edebilirsiniz.
            </p>
          </div>

          {/* Hızlı Erişim Linkleri */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <FaLightbulb className="text-yellow-500" />
              Hızlı Erişim
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {quickLinks.map((link, index) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`${link.color} p-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg group`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                      {link.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800 group-hover:text-gray-900">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              <FaArrowLeft className="text-sm" />
              Geri Dön
            </button>
            
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
            >
              <FaHome className="text-sm" />
              Ana Sayfa
            </Link>

            <Link
              href="/site/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              <FaRocket className="text-sm" />
              Dashboard'a Git
            </Link>
          </div>

          {/* Yardım Metni */}
          <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Yardıma mı ihtiyacınız var?
            </h3>
            <p className="text-gray-600 mb-4">
              Eğer bu sayfaya bir linkten geldiyseniz, lütfen linki kontrol edin. 
              Sorun devam ederse sistem yöneticisi ile iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/site/settings"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ayarlar
              </Link>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <Link
                href="/site/patients"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Hasta Yönetimi
              </Link>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <Link
                href="/site/offers"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Teklif Yönetimi
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animasyonları */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
} 