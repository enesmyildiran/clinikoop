'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.isSuperAdmin) {
          router.push('/admin/dashboard')
        } else {
          setError('Bu sayfa sadece süper adminler için')
        }
      } else {
        const data = await response.json()
        setError(data.message || 'Giriş başarısız')
      }
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-500 to-pink-700">
      <div className="w-full max-w-md bg-white/10 rounded-3xl shadow-xl p-8 backdrop-blur-lg">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-4">👑</span>
          <h2 className="text-2xl font-bold text-white mb-2">Yönetici Girişi</h2>
          <p className="text-red-100">Süper admin erişimi</p>
        </div>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-white mb-1">E-posta</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-red-500 focus:outline-none text-gray-900 bg-white"
              placeholder="admin@clinikoop.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-1">Şifre</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-red-500 focus:outline-none text-gray-900 bg-white"
              placeholder="Şifreniz"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <div className="text-red-300 text-sm text-center">{error}</div>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Giriş yapılıyor...' : 'Yönetici Girişi'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-red-100">
          <Link href="/login" className="text-white font-medium hover:underline">
            ← Klinik Girişine Dön
          </Link>
        </div>
      </div>
    </div>
  )
} 