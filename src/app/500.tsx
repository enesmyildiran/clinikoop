import Link from 'next/link'
import { FaRegDizzy } from 'react-icons/fa'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-orange-100">
      <div className="flex flex-col items-center">
        <FaRegDizzy className="text-red-500 text-7xl mb-4" />
        <h1 className="text-4xl font-bold text-red-700 mb-2">500 - Sunucu Hatası</h1>
        <p className="text-lg text-red-600 mb-6">Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
        <Link href="/" className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">Ana Sayfa</Link>
      </div>
    </div>
  )
} 