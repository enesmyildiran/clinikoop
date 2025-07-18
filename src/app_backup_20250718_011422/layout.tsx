import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Providers from './providers'
import { ToastProvider } from '@/components/ui/Toast'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Clinikoop - Diş Klinikleri için Hasta Teklif Yönetimi',
  description: 'Diş kliniklerinin hasta teklif süreçlerini yönetmesine odaklanan, link tabanlı hasta erişimi sunan SaaS platformu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
  const segments = pathname.split('/').filter(Boolean);
  const isOfferPage = segments[0] === 'offer';
  const isAdminPage = segments[0] === 'admin';

  if (isAdminPage) {
    return (
      <html lang="tr">
        <body className={inter.className + ' overflow-x-hidden'}>
          <ToastProvider>
            <Providers>
              {children}
            </Providers>
          </ToastProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="tr">
      <body className={inter.className + ' overflow-x-hidden'}>
        <ToastProvider>
          <Providers>
            {isOfferPage ? (
              <div className="min-h-screen bg-gray-50">
                <main className="flex-1">
                  {children}
                </main>
              </div>
            ) : (
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="flex flex-1">
                  <Sidebar />
                  <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 p-6">
                      {children}
                    </main>
                  </div>
                </div>
                <Footer />
              </div>
            )}
          </Providers>
        </ToastProvider>
      </body>
    </html>
  )
} 