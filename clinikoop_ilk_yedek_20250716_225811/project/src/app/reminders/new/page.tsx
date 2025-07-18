"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaArrowLeft, FaSave, FaUser, FaCalendarAlt, FaBell } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useReminders } from '@/contexts/ReminderContext'
import { useToast } from '@/components/ui/Toast'

export default function NewReminderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { createReminder } = useReminders()
  const { addToast } = useToast()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().slice(0, 16), // Şu anki tarih ve saat
    priority: 'MEDIUM',
    isPrivate: false,
    patientId: '',
    offerId: ''
  })
  
  const [patients, setPatients] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPatients()
    fetchOffers()
    
    // URL parametrelerini kontrol et
    const patientId = searchParams.get('patientId')
    const patientName = searchParams.get('patientName')
    const offerId = searchParams.get('offerId')
    const offerTitle = searchParams.get('offerTitle')
    
    if (patientId) {
      setFormData(prev => ({ ...prev, patientId }))
    }
    
    if (offerId) {
      setFormData(prev => ({ ...prev, offerId }))
    }
    
    // Eğer teklif başlığı varsa, hatırlatma başlığını otomatik doldur
    if (offerTitle) {
      setFormData(prev => ({ 
        ...prev, 
        title: `${offerTitle} - Takip`,
        description: `Teklif takibi: ${offerTitle}${patientName ? ` (${patientName})` : ''}`
      }))
    } else if (patientName) {
      // Sadece hasta adı varsa
      setFormData(prev => ({ 
        ...prev, 
        title: `${patientName} - Hasta Takibi`,
        description: `Hasta takibi: ${patientName}`
      }))
    }
  }, [searchParams])

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients')
      const data = await res.json()
      if (data.patients) {
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Hastalar yüklenirken hata:', error)
    }
  }

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers')
      const data = await res.json()
      if (data.offers) {
        setOffers(data.offers)
      }
    } catch (error) {
      console.error('Teklifler yüklenirken hata:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.dueDate) {
      addToast({
        message: 'Başlık ve tarih alanları zorunludur',
        type: 'error'
      })
      return
    }

    // Tarih validasyonu
    const selectedDate = new Date(formData.dueDate)
    if (isNaN(selectedDate.getTime())) {
      addToast({
        message: 'Geçersiz tarih formatı',
        type: 'error'
      })
      return
    }

    setLoading(true)
    try {
      const success = await createReminder({
        ...formData,
        userId: 'mock-user-id' // Gerçek uygulamada auth'dan gelecek
      })
      
      if (success) {
        router.push('/reminders')
      }
    } catch (error) {
      addToast({
        message: 'Hatırlatma oluşturulurken hata oluştu',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
        >
          <FaArrowLeft className="mr-2" />
          Geri
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Yeni Hatırlatma</h1>
          <p className="text-gray-600">Yeni bir hatırlatma oluşturun</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Temel Bilgiler */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaBell className="text-blue-500" />
              Temel Bilgiler
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Hatırlatma başlığı"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Hatırlatma detayları..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarih *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Öncelik
                </label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Düşük</SelectItem>
                    <SelectItem value="MEDIUM">Orta</SelectItem>
                    <SelectItem value="HIGH">Yüksek</SelectItem>
                    <SelectItem value="URGENT">Acil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* İlişkili Bilgiler */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaUser className="text-green-500" />
              İlişkili Bilgiler
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta (İsteğe bağlı)
                </label>
                <Select 
                  value={formData.patientId || "none"} 
                  onValueChange={(value) => handleInputChange('patientId', value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Hasta seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Hasta seçmeyin</SelectItem>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teklif (İsteğe bağlı)
                </label>
                <Select 
                  value={formData.offerId || "none"} 
                  onValueChange={(value) => handleInputChange('offerId', value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Teklif seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Teklif seçmeyin</SelectItem>
                    {offers.map((offer) => (
                      <SelectItem key={offer.id} value={offer.id}>
                        {offer.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Ayarlar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaCalendarAlt className="text-purple-500" />
              Ayarlar
            </h3>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrivate"
                checked={formData.isPrivate}
                onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPrivate" className="text-sm text-gray-700">
                Bu hatırlatma sadece benim için olsun (özel)
              </label>
            </div>
          </div>

          {/* Aksiyonlar */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <FaSave className="w-4 h-4" />
              {loading ? 'Kaydediliyor...' : 'Hatırlatma Oluştur'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 