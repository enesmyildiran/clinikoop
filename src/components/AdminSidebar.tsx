'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaHospital, FaUsers, FaCog, FaFilePdf, FaDatabase, FaFileAlt, FaChartPie, FaShieldAlt, FaBug, FaHeadset } from 'react-icons/fa';

const adminMenu = [
  {
    title: 'Yönetim',
    items: [
      { href: '/admin', icon: FaChartBar, label: 'Yönetici Paneli' },
      { href: '/admin/clinics', icon: FaHospital, label: 'Klinik Yönetimi' },
      { href: '/admin/users', icon: FaUsers, label: 'Kullanıcı Yönetimi' },
      { href: '/admin/settings', icon: FaCog, label: 'Sistem Ayarları' },
      { href: '/admin/module-settings', icon: FaCog, label: 'Modül Ayarları' },
      { href: '/admin/pdf-templates', icon: FaFilePdf, label: 'PDF Şablonları' },
      { href: '/admin/backup', icon: FaDatabase, label: 'Yedekleme' },
      { href: '/admin/logs', icon: FaBug, label: 'Loglar' },
      { href: '/admin/analytics', icon: FaChartPie, label: 'Analizler' },
    ]
  },
  {
    title: 'Destek Sistemi',
    items: [
      { href: '/admin/support', icon: FaHeadset, label: 'Destek Talepleri' },
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col bg-white border-r shadow-sm py-6 w-64">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center h-16 w-full gap-3">
          <span className="text-3xl text-blue-600 font-bold">🦷</span>
          <span className="text-xl font-bold text-blue-600 transition-all duration-200">Clinikoop</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {adminMenu.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            <div className="px-4 mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{group.title}</span>
            </div>
            <div className="space-y-1">
              {group.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                const active = pathname === item.href;
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
                    <span className="ml-3 font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
} 