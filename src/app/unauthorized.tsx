import Link from 'next/link'
import { FaLock } from 'react-icons/fa'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100">
      <div className="flex flex-col items-center">
        <FaLock className="text-yellow-600 text-7xl mb-4" />
        <h1 className="text-4xl font-bold text-yellow-700 mb-2">Yetkisiz Erişim</h1>
        <p className="text-lg text-yellow-600 mb-6">Bu sayfaya erişim izniniz yok.</p>
        <Link href="/login" className="px-6 py-2 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition-colors">Giriş Yap</Link>
      </div>
    </div>
  )
} 