'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  FaUserFriends, 
  FaClipboardList, 
  FaCheckCircle, 
  FaClock, 
  FaUserPlus, 
  FaLightbulb,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaBell,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaHourglassHalf,
  FaTags,
  FaUser,
  FaLink,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa'
import Link from 'next/link'

interface Patient {
  id: string
  name: string
  email?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

interface Offer {
  id: string
  patient: { name: string }
  status: {
    id: string
    name: string
    displayName: string
    color: string
  }
  createdAt: string
  totalPrice?: number
  currency?: string
  title: string
  slug: string
}

interface Reminder {
  id: string
  title: string
  dueDate: string
  patientName?: string
  priority: 'low' | 'medium' | 'high'
  description?: string
}

interface OfferStatus {
  id: string
  name: string
  displayName: string
  color: string
  order: number
  isDefault: boolean
  isActive: boolean
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [patients, setPatients] = useState<Patient[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [statuses, setStatuses] = useState<OfferStatus[]>([])

  // İstatistikler
  const [stats, setStats] = useState({
    offersThisMonth: 0,
    patientsThisMonth: 0,
    thinkingOffers: 0,
    acceptedPatientsThisMonth: 0,
  })



  const fetchData = async () => {
    setIsLoading(true)
    try {
      console.log('Dashboard verileri yükleniyor...')
      
      const [offersRes, patientsRes, remindersRes, statusesRes] = await Promise.all([
        fetch('/api/offers'),
        fetch('/api/patients'),
        fetch('/api/reminders'),
        fetch('/api/offer-statuses'),
      ])
      
      const offersData = await offersRes.json()
      const patientsData = await patientsRes.json()
      const remindersData = await remindersRes.json()
      const statusesData = await statusesRes.json()

      console.log('API Responses:', {
        offers: offersData,
        patients: patientsData,
        reminders: remindersData,
        statuses: statusesData
      })

      // API response formatlarını düzelt
      const offers = offersData.offers || []
      const patients = patientsData.patients || []
      const reminders = remindersData.reminders || []
      const statuses = statusesData.statuses || []

      console.log('Parsed Data:', {
        offersCount: offers.length,
        patientsCount: patients.length,
        remindersCount: reminders.length,
        statusesCount: statuses.length
      })

      // Debug: Teklif durumlarını kontrol et
      console.log('🔍 Dashboard - Teklif durumları:', offers.map((o: any) => ({
        id: o.id,
        title: o.title,
        status: o.status?.name,
        statusDisplay: o.status?.displayName,
        patient: o.patient?.name
      })))

      console.log('🔍 Dashboard - Durumlar:', statuses.map((s: any) => ({
        id: s.id,
        name: s.name,
        displayName: s.displayName,
        isActive: s.isActive
      })))

      // Son 30 gün için filtrele
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const offersThisMonth = offers.filter((o: any) => new Date(o.createdAt) >= startOfMonth)
      const patientsThisMonth = patients.filter((p: any) => new Date(p.createdAt) >= startOfMonth)
      const thinkingOffers = offers.filter((o: any) => o.status?.name?.toLowerCase() === 'pending' || o.status?.name?.toLowerCase() === 'düşünmede').length
      // Kabul edilen hasta: Bu ay içinde teklifi kabul edilen hastalar (offer.status === 'accepted')
      const acceptedPatientsThisMonth = offersThisMonth.filter((o: any) => o.status?.name?.toLowerCase() === 'accepted').length

      setStats({
        offersThisMonth: offersThisMonth.length,
        patientsThisMonth: patientsThisMonth.length,
        thinkingOffers,
        acceptedPatientsThisMonth,
      })
      setOffers(offers) // Tüm teklifleri göster
      setPatients(patients.slice(0, 5))
      setReminders(reminders.slice(0, 5))
      setStatuses(statuses)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Dashboard verileri yüklenirken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Her 30 saniyede bir otomatik yenile
    const interval = setInterval(fetchData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Scroll oklarını ve progress'i kontrol eden fonksiyon


  const getStatusIcon = (status: any) => {
    switch (status?.name?.toLowerCase()) {
      case 'accepted':
        return <FaCheck className="text-emerald-500" />
      case 'pending':
      case 'düşünmede':
        return <FaHourglassHalf className="text-yellow-500" />
      case 'rejected':
      case 'reddedildi':
        return <FaTimes className="text-red-500" />
      default:
        return <FaClock className="text-gray-500" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <FaExclamationTriangle className="text-red-500" />
      case 'medium':
        return <FaBell className="text-yellow-500" />
      case 'low':
        return <FaCheck className="text-green-500" />
      default:
        return <FaBell className="text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-w-0">


      {/* Üstte 4 istatistik kutusu */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">{stats.offersThisMonth}</div>
              <div className="text-sm text-blue-700 font-medium">Bu ay verilen teklif</div>
            </div>
            <FaClipboardList className="text-blue-500 text-3xl" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">{stats.patientsThisMonth}</div>
              <div className="text-sm text-green-700 font-medium">Bu ay eklenen hasta</div>
            </div>
            <FaUserPlus className="text-green-500 text-3xl" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">{stats.thinkingOffers}</div>
              <div className="text-sm text-yellow-700 font-medium">Düşünme aşamasında</div>
            </div>
            <FaLightbulb className="text-yellow-500 text-3xl" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm p-6 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-emerald-600">{stats.acceptedPatientsThisMonth}</div>
              <div className="text-sm text-emerald-700 font-medium">Bu ay kabul edilen</div>
            </div>
            <FaCheckCircle className="text-emerald-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Orta grid: Hatırlatmalar ve Hastalar yan yana */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Hatırlatmalar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaBell className="text-blue-500" />
                Yaklaşan Hatırlatmalar
              </h2>
              <Link href="/site/reminders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Tümünü Gör →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {reminders.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <FaBell className="text-4xl mx-auto mb-3 text-gray-300" />
                <p>Yaklaşan hatırlatma yok</p>
              </div>
            )}
            {reminders.map(reminder => (
              <div key={reminder.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getPriorityIcon(reminder.priority)}
                      <div className="font-medium text-gray-800">{reminder.title}</div>
                    </div>
                    {reminder.description && (
                      <div className="text-sm text-gray-600 mb-2">{reminder.description}</div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaUserFriends />
                        {reminder.patientName || 'Genel'}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt />
                        {new Date(reminder.dueDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/site/reminders/${reminder.id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <FaEye />
                    </Link>
                    <Link href={`/site/reminders/${reminder.id}/edit`} className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                      <FaEdit />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hasta Listesi */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaUserFriends className="text-green-500" />
                Yeni/Son Düzenlenen Hastalar
              </h2>
              <Link href="/site/patients" className="text-green-600 hover:text-green-700 text-sm font-medium">
                Tümünü Gör →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {patients.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <FaUserFriends className="text-4xl mx-auto mb-3 text-gray-300" />
                <p>Hasta bulunamadı</p>
              </div>
            )}
            {patients.map(patient => (
              <div key={patient.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 mb-2">{patient.name}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      {patient.phone && (
                        <div className="flex items-center gap-1">
                          <FaPhone />
                          {patient.phone}
                        </div>
                      )}
                      {patient.email && (
                        <div className="flex items-center gap-1">
                          <FaEnvelope />
                          {patient.email}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FaCalendarAlt />
                      Son güncelleme: {new Date(patient.updatedAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/site/patients/${patient.id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <FaEye />
                    </Link>
                    <Link href={`/site/patients/${patient.id}/edit`} className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                      <FaEdit />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teklif Listesi tam genişlikte */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaClipboardList className="text-purple-500" />
                Son Teklifler
              </h2>
              <Link href="/site/offers" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Tümünü Gör →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {offers.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <FaClipboardList className="text-4xl mx-auto mb-3 text-gray-300" />
                <p>Henüz teklif oluşturulmamış</p>
                <p className="text-sm text-gray-400 mt-1">İlk teklifinizi oluşturmak için "Yeni Teklif" butonunu kullanın</p>
              </div>
            )}
            {offers.slice(0, 5).map(offer => (
              <div key={offer.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(offer.status)}
                      <div className="font-medium text-gray-800">{offer.patient?.name || '-'}</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt />
                        {new Date(offer.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                      {offer.totalPrice && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{offer.totalPrice.toLocaleString('tr-TR')} {offer.currency || 'TRY'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                                     <div className="flex items-center gap-3">
                     <div 
                       className="text-xs px-3 py-1 rounded-full font-medium"
                       style={{
                         backgroundColor: `${offer.status.color}20`,
                         color: offer.status.color
                       }}
                     >
                       {offer.status.displayName}
                     </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/site/offers/${offer.id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <FaEye />
                      </Link>
                      <Link href={`/site/offers/${offer.id}/edit`} className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                        <FaEdit />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {offers.length > 5 && (
              <div className="p-4 text-center text-gray-500 border-t border-gray-100">
                <p className="text-sm">
                  <span className="font-medium">{offers.length - 5}</span> teklif daha var. 
                  <Link href="/site/offers" className="text-purple-600 hover:text-purple-700 ml-1 font-medium">
                    Tümünü görüntüle &rarr;
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 