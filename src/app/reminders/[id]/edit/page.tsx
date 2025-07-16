'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FaSave } from 'react-icons/fa'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select'
import { useReminders } from '@/contexts/ReminderContext'

export default function ReminderEditPage() {
  const router = useRouter()
  const params = useParams()
  const { updateReminder } = useReminders()
  const [reminder, setReminder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [customPatient, setCustomPatient] = useState('')
  const [selectedOffer, setSelectedOffer] = useState('')
  const [date, setDate] = useState('')
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('')

  useEffect(() => {
    fetch(`/api/reminders/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setReminder(data.reminder)
        setSelectedPatient(data.reminder.patient?.id || (data.reminder.patientName ? 'custom' : ''))
        setCustomPatient(data.reminder.patientName || '')
        setSelectedOffer(data.reminder.offer?.id || '')
        if (data.reminder.dueDate) {
          const d = new Date(data.reminder.dueDate)
          setDate(d.toISOString().slice(0,10))
          setHour(d.getHours().toString().padStart(2, '0'))
          setMinute(d.getMinutes().toString().padStart(2, '0'))
        }
      })
      .catch(() => setError('Hatırlatma bulunamadı'))
      .finally(() => setLoading(false))
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => setPatients(data.patients || []))
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => setOffers(data.offers || []))
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setReminder({ ...reminder, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    // Hasta ve teklif alanlarını ayarla
    let patientId = selectedPatient !== 'custom' && selectedPatient !== 'none' ? selectedPatient : undefined
    let patientName = selectedPatient === 'custom' ? customPatient : undefined
    let offerId = selectedOffer !== 'none' ? selectedOffer : undefined
    
    // Tarih+Saat birleştir
    let dueDate = date
    if (hour && minute) dueDate += `T${hour.padStart(2,'0')}:${minute.padStart(2,'0')}:00.000Z`
    else if (date) dueDate += 'T00:00:00.000Z'
    
    const success = await updateReminder(params.id as string, {
      ...reminder,
      patientId,
      patientName,
      offerId,
      dueDate
    })
    
    if (success) {
      router.push(`/reminders/${params.id}`)
    } else {
      setError('Kaydetme sırasında hata oluştu')
    }
    setSaving(false)
  }

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!reminder) return null

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-8 space-y-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Hatırlatmayı Düzenle</h1>
      <div>
        <label className="block text-sm font-medium mb-1">Başlık</label>
        <input name="title" value={reminder.title || ''} onChange={handleChange} className="w-full border rounded p-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Açıklama</label>
        <textarea name="description" value={reminder.description || ''} onChange={handleChange} className="w-full border rounded p-2" rows={3} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Hasta</label>
        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
          <SelectTrigger>
            <SelectValue placeholder="Hasta seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Seçili değil</SelectItem>
            {patients.map((p: any) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
            <SelectItem value="custom">Diğer / Manuel Gir</SelectItem>
          </SelectContent>
        </Select>
        {selectedPatient === 'custom' && (
          <input type="text" value={customPatient} onChange={e => setCustomPatient(e.target.value)} className="w-full border rounded p-2 mt-2" placeholder="Hasta adı yazın" />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Teklif (opsiyonel)</label>
        <Select value={selectedOffer} onValueChange={setSelectedOffer}>
          <SelectTrigger>
            <SelectValue placeholder="Teklif seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Seçili değil</SelectItem>
            {offers.map((o: any) => (
              <SelectItem key={o.id} value={o.id}>{o.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tarih</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded p-2" required />
        <div className="flex gap-2 mt-2">
          <input type="number" min="0" max="23" value={hour} onChange={e => setHour(e.target.value)} className="w-20 border rounded p-2" placeholder="Saat" />
          <input type="number" min="0" max="59" value={minute} onChange={e => setMinute(e.target.value)} className="w-20 border rounded p-2" placeholder="Dakika" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Öncelik</label>
        <select name="priority" value={reminder.priority || 'medium'} onChange={handleChange} className="w-full border rounded p-2">
          <option value="high">Yüksek</option>
          <option value="medium">Orta</option>
          <option value="low">Düşük</option>
        </select>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-60" disabled={saving}>
        <FaSave /> Kaydet
      </button>
    </form>
  )
} 