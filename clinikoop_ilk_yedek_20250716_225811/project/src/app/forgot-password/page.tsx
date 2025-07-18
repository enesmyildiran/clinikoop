'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaFacebookF, FaGoogle, FaXTwitter } from 'react-icons/fa6'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      // API entegrasyonu burada olacak
      setTimeout(() => {
        setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')
        setLoading(false)
      }, 1200)
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700">
      <div className="w-full max-w-4xl bg-white/10 rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Sol: Maskot/İllüstrasyon */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 p-10">
          <div className="mb-8">
            <span className="text-[120px] block drop-shadow-lg">🦷</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Clinikoop</h2>
          <p className="text-lg text-blue-100 text-center max-w-xs">
            Diş klinikleri için modern teklif yönetimi platformu
          </p>
        </div>
        {/* Sağ: Şifre Sıfırlama Formu */}
        <div className="w-full md:w-1/2 bg-white/80 backdrop-blur-lg p-8 flex flex-col justify-center">
          <div className="flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-blue-700">Şifremi Unuttum</span>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            {message && <div className="text-green-600 text-sm text-center">{message}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            <Link href="/login" className="text-blue-700 font-medium hover:underline">Giriş Yap</Link>
          </div>
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-400 text-xs">veya</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <div className="flex justify-center gap-4">
            <button className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 hover:bg-blue-200 transition-colors">
              <FaFacebookF size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
              <FaXTwitter size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors">
              <FaGoogle size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 