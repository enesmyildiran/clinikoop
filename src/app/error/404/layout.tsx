import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Error404Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 