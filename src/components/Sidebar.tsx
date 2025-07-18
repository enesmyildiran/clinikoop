'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FaChartBar, 
  FaUsers, 
  FaClipboardList, 
  FaBell, 
  FaChartLine, 
  FaUserCircle, 
  FaCog, 
  FaShieldAlt,
  FaFileAlt,
  FaBars,
  FaTimes,
  FaChartPie,
  FaPlus,
  FaList,
  FaEye,
  FaUserPlus,
  FaFilePdf,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa'

interface MenuGroup {
  title: string
  items: MenuItem[]
  expanded?: boolean
}

interface MenuItem {
  href: string
  icon: any
  label: string
  badge?: string
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Ana Menü',
    items: [
      { href: '/site/dashboard', icon: FaChartBar, label: 'Dashboard' },
    ]
  },
  {
    title: 'Hasta Yönetimi',
    items: [
      { href: '/site/patients/new', icon: FaUserPlus, label: 'Yeni Hasta Oluştur' },
      { href: '/site/patients', icon: FaList, label: 'Tüm Hastalar' },
    ]
  },
  {
    title: 'Teklif Yönetimi',
    items: [
      { href: '/site/offers/new', icon: FaPlus, label: 'Yeni Teklif Oluştur' },
      { href: '/site/offers', icon: FaList, label: 'Tüm Teklifler' },
    ]
  },
  {
    title: 'Sistem',
    items: [
      { href: '/site/reminders', icon: FaBell, label: 'Hatırlatmalar' },
      { href: '/site/performance', icon: FaChartLine, label: 'Performans' },
      { href: '/site/reports', icon: FaChartPie, label: 'Raporlama' },
    ]
  },
  {
    title: 'Yönetim',
    items: [
      { href: '/site/users', icon: FaUsers, label: 'Kullanıcı Yönetimi' },
      { href: '/site/settings', icon: FaCog, label: 'Sistem Ayarları' },
    ]
  }
]

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({
    'Ana Menü': true,
    'Hasta Yönetimi': true,
    'Teklif Yönetimi': true,
    'Sistem': true,
    'Yönetim': true
  })
  const pathname = usePathname()

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }))
  }

  const isActive = (href: string) => {
    if (href === '/site/dashboard') {
      return pathname === '/site/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className={`hidden md:flex flex-col bg-white border-r shadow-sm py-6 transition-all duration-300 ${sidebarExpanded ? 'w-64' : 'w-20'} ${className}`}>
      {/* Logo ve Hamburger Menü kutusu */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center h-16 w-full gap-3">
          <span className="text-3xl text-blue-600 font-bold">🦷</span>
          {sidebarExpanded && <span className="text-xl font-bold text-blue-600 transition-all duration-200">Clinikoop</span>}
          <button 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="ml-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menüyü Aç/Kapat"
          >
            {sidebarExpanded ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        {menuGroups.map((group, groupIndex) => {
          const isGroupExpanded = expandedGroups[group.title]
          
          return (
            <div key={groupIndex} className="mb-4">
              {/* Grup Başlığı */}
              {sidebarExpanded && (
                <div className="px-4 mb-2">
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                  >
                    <span>{group.title}</span>
                    {isGroupExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                  </button>
                </div>
              )}
              
              {/* Grup Öğeleri */}
              {isGroupExpanded && (
                <div className="space-y-1">
                  {group.items.map((item, itemIndex) => {
                    const IconComponent = item.icon
                    const active = isActive(item.href)
                    
                    return (
                      <Link 
                        key={itemIndex}
                        href={item.href} 
                        className={`flex items-center px-4 py-2.5 mx-2 rounded-lg transition-colors ${
                          active 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                        }`}
                      >
                        <IconComponent size={20} />
                        {sidebarExpanded && (
                          <span className="ml-3 font-medium text-sm">{item.label}</span>
                        )}
                        {item.badge && sidebarExpanded && (
                          <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
} 