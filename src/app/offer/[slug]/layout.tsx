import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function OfferLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className + " min-h-screen bg-gray-50"}>
        {children}
      </body>
    </html>
  );
} 