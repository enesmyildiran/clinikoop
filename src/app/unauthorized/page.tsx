import Link from 'next/link';
import { FaShieldAlt, FaArrowLeft, FaHome } from 'react-icons/fa';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaShieldAlt className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h1>
        
        <p className="text-gray-600 mb-8">
          Bu sayfaya erişim yetkiniz bulunmamaktadır. Lütfen giriş yapın veya 
          yetkili bir kullanıcı ile iletişime geçin.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/login" 
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            Giriş Yap
          </Link>
          
          <Link 
            href="/" 
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <FaHome className="w-4 h-4" />
            Ana Sayfa
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Sorun yaşıyorsanız{' '}
            <Link href="/support" className="text-blue-600 hover:underline">
              destek ekibimizle
            </Link>{' '}
            iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
} 