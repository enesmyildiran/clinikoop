import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
  return (
    <html lang="tr">
      <body className={inter.className + ' overflow-x-hidden'}>
        {children}
      </body>
    </html>
  )
}
