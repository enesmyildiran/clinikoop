'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Session yükleniyor
    if (status === 'loading') {
      return;
    }

    // Kullanıcı giriş yapmamış
    if (status === 'unauthenticated') {
      router.push('/admin-login');
      return;
    }

    // Session var ama user yok
    if (!session?.user) {
      router.push('/admin-login');
      return;
    }

    // Kullanıcının rolünü kontrol et
    const user = session.user as any;
    if (!user.role || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      router.push('/unauthorized');
      return;
    }

    // Yetkili kullanıcı
    setIsAuthorized(true);
  }, [session, status, router]);

  // Yükleniyor durumu
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Yetkisiz erişim - henüz yetkilendirme yapılmadı
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 