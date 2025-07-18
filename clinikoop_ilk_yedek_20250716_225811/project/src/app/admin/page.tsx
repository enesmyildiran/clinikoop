import Link from 'next/link'
import { FaUsers, FaChartBar, FaCog, FaShieldAlt, FaFileAlt, FaBell, FaDatabase, FaKey } from 'react-icons/fa'

const adminStats = [
  { label: 'Toplam Kullanıcı', value: '12', icon: <FaUsers className="text-blue-500 text-2xl" />, color: 'bg-blue-50' },
  { label: 'Aktif Oturumlar', value: '8', icon: <FaChartBar className="text-green-500 text-2xl" />, color: 'bg-green-50' },
  { label: 'Sistem Durumu', value: 'Aktif', icon: <FaShieldAlt className="text-indigo-500 text-2xl" />, color: 'bg-indigo-50' },
  { label: 'Veritabanı Boyutu', value: '2.4 GB', icon: <FaDatabase className="text-orange-500 text-2xl" />, color: 'bg-orange-50' },
]

const adminModules = [
  { 
    title: 'Kullanıcı Yönetimi', 
    description: 'Kullanıcı hesaplarını yönet, roller atama ve izinleri düzenle',
    icon: <FaUsers className="text-blue-600 text-3xl" />,
    href: '/users',
    color: 'bg-blue-50 hover:bg-blue-100'
  },
  { 
    title: 'Sistem Ayarları', 
    description: 'Genel sistem ayarları, tema ve yapılandırma seçenekleri',
    icon: <FaCog className="text-gray-600 text-3xl" />,
    href: '/settings',
    color: 'bg-gray-50 hover:bg-gray-100'
  },
  { 
    title: 'PDF Şablonları', 
    description: 'Teklif PDF şablonlarını özelleştir ve yönet',
    icon: <FaFileAlt className="text-green-600 text-3xl" />,
    href: '/pdf-templates',
    color: 'bg-green-50 hover:bg-green-100'
  },
  { 
    title: 'Tüm Teklifler', 
    description: 'Sistemdeki tüm teklifleri görüntüle ve yönet',
    icon: <FaFileAlt className="text-purple-600 text-3xl" />,
    href: '/all-offers',
    color: 'bg-purple-50 hover:bg-purple-100'
  },
  { 
    title: 'Güvenlik Ayarları', 
    description: 'Güvenlik politikaları, şifre kuralları ve erişim kontrolü',
    icon: <FaKey className="text-red-600 text-3xl" />,
    href: '/security',
    color: 'bg-red-50 hover:bg-red-100'
  },
  { 
    title: 'Sistem Logları', 
    description: 'Sistem aktivitelerini ve hata loglarını görüntüle',
    icon: <FaBell className="text-yellow-600 text-3xl" />,
    href: '/logs',
    color: 'bg-yellow-50 hover:bg-yellow-100'
  },
]

export default function AdminPage() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Yönetici Paneli</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 font-medium">Sistem Durumu</button>
          <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200">Yedekleme</button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat, i) => (
          <div key={i} className={`flex flex-col items-center justify-center rounded-xl shadow p-6 ${stat.color}`}>
            {stat.icon}
            <div className="text-2xl font-bold mt-2">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Yönetici Modülleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Link key={index} href={module.href} className={`block rounded-xl shadow p-6 transition-all duration-200 ${module.color}`}>
            <div className="flex items-start justify-between mb-4">
              {module.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{module.title}</h3>
            <p className="text-gray-600 text-sm">{module.description}</p>
          </Link>
        ))}
      </div>

      {/* Hızlı Eylemler */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Hızlı Eylemler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
            <FaUsers className="text-blue-600" />
            <span className="font-medium text-blue-800">Yeni Kullanıcı Ekle</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
            <FaDatabase className="text-green-600" />
            <span className="font-medium text-green-800">Veritabanı Yedekle</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
            <FaCog className="text-orange-600" />
            <span className="font-medium text-orange-800">Sistem Güncelle</span>
          </button>
        </div>
      </div>
    </div>
  )
} 