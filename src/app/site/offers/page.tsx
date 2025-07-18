"use client"

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FaPlus, FaFilePdf, FaSearch, FaEye, FaLink, FaTrash, FaUser, FaEdit, FaBell, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import PriceDisplay from '@/components/ui/PriceDisplay'
import { CurrencyCode } from '@/lib/currency'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([])
  const [statuses, setStatuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currencyFilter, setCurrencyFilter] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addToast } = useToast()

  // Confirm dialog states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Hastaya göre gruplama ve sıralama
  const offersByPatient = useMemo(() => {
    const groups: Record<string, { patient: any, offers: any[] }> = {};
    offers.forEach((offer) => {
      const patientId = offer.patient?.id || 'deleted';
      if (!groups[patientId]) {
        groups[patientId] = {
          patient: offer.patient,
          offers: []
        };
      }
      groups[patientId].offers.push(offer);
    });
    // En çok teklifi olan hasta en üstte
    return Object.values(groups).sort((a, b) => b.offers.length - a.offers.length);
  }, [offers]);

  const [expandedPatientIds, setExpandedPatientIds] = useState<string[]>([]);

  const togglePatientAccordion = (patientId: string) => {
    setExpandedPatientIds((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId]
    );
  };

  useEffect(() => {
    const q = searchParams.get('q') || ''
    const status = searchParams.get('status') || ''
    const currency = searchParams.get('currency') || ''
    setSearch(q)
    setStatusFilter(status)
    setCurrencyFilter(currency)
    fetchOffers(q, status, currency)
    fetchStatuses()
  }, [searchParams])

  const fetchStatuses = async () => {
    try {
      const res = await fetch('/api/offer-statuses')
      const data = await res.json()
      if (data.success) {
        setStatuses(data.statuses)
      }
    } catch (error) {
      console.error('Statuses fetch error:', error)
    }
  }

  const fetchOffers = async (q: string, status: string, currency: string) => {
    setLoading(true)
    try {
      console.log('Teklifler yükleniyor...')
      const res = await fetch('/api/offers')
      const data = await res.json()
      
      console.log('Teklifler API Response:', data)
      
      if (!data.success) {
        console.error('Offers API error:', data.message)
        setOffers([])
        return
      }
      
      let filtered = data.offers || []
      console.log('Filtrelenmemiş teklifler:', filtered.length)
      
      if (q) {
        const qLower = q.toLowerCase()
        filtered = filtered.filter((offer: any) =>
          (offer.patient?.name || '').toLowerCase().includes(qLower) ||
          (offer.title || '').toLowerCase().includes(qLower)
        )
      }
      
      if (status) {
        filtered = filtered.filter((offer: any) => offer.status?.id === status)
      }
      
      if (currency) {
        filtered = filtered.filter((offer: any) => offer.currency === currency)
      }
      
      setOffers(filtered)
    } catch (error) {
      console.error('Fetch offers error:', error)
      setOffers([])
    }
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (statusFilter) params.set('status', statusFilter)
    if (currencyFilter) params.set('currency', currencyFilter)
    router.replace(`/offers${params.toString() ? `?${params}` : ''}`)
  }

  const handleDelete = async () => {
    if (!offerToDelete || isDeleting) return
    
    setIsDeleting(true)
    try {
      // Önce teklifi bul
      const offer = offers.find(o => o.id === offerToDelete);
      if (!offer) return;
      
      // Slug ile sil
      const res = await fetch(`/api/offers/${offer.slug}`, { method: 'DELETE' });
      if (res.ok) {
        setOffers(offers.filter(offer => offer.id !== offerToDelete));
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error('Teklif silinirken hata:', error);
    } finally {
      setIsDeleting(false)
      setOfferToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setOfferToDelete(id)
    setShowDeleteDialog(true)
  }

  const copyLink = async (slug: string) => {
    const link = `${window.location.origin}/offer/${slug}`
    try {
      await navigator.clipboard.writeText(link)
      addToast({ message: 'Link kopyalandı!', type: 'success' })
    } catch {
      addToast({ message: 'Link kopyalanamadı', type: 'error' })
    }
  }

  const handleCreateReminder = (offerId: string, offerTitle: string, patientName: string) => {
    router.push(`/site/reminders/new?offerId=${offerId}&offerTitle=${encodeURIComponent(offerTitle)}&patientName=${encodeURIComponent(patientName)}`);
  };

  const getStatusText = (status: any) => {
    if (status?.displayName) return status.displayName
    if (status?.name) return status.name
    return status || 'Bilinmeyen'
  }

  const getStatusColor = (status: any) => {
    if (status?.color) {
      // Hex rengi kullanarak dinamik stil oluştur
      const color = status.color
      return `bg-[${color}15] text-[${color}] border border-[${color}30]`
    }
    
    // Varsayılan renkler
    const statusName = status?.name?.toLowerCase() || status?.toLowerCase()
    switch (statusName) {
      case 'accepted':
      case 'kabul edildi':
        return 'bg-green-100 text-green-700 border border-green-200'
      case 'sent':
      case 'gönderildi':
        return 'bg-blue-100 text-blue-700 border border-blue-200'
      case 'draft':
      case 'taslak':
        return 'bg-gray-100 text-gray-700 border border-gray-200'
      case 'pending':
      case 'düşünmede':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
      case 'rejected':
      case 'reddedildi':
        return 'bg-red-100 text-red-700 border border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Teklif Listesi</h1>
        <Link href="/site/offers/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
          <FaPlus /> Yeni Teklif
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Hasta adı veya teklif başlığı ile ara..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
          >
            <option value="">Tüm Durumlar</option>
            {statuses.map((status: any) => (
              <option key={status.id} value={status.id} className="flex items-center gap-2">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: status.color || '#6B7280' }}
                />
                {status.displayName}
              </option>
            ))}
          </select>
          <select
            value={currencyFilter}
            onChange={e => setCurrencyFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
          >
            <option value="">Tüm Para Birimleri</option>
            <option value="TRY">TRY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium flex items-center gap-2">
            <FaSearch /> Ara
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <div className="text-center text-gray-500 py-12">Yükleniyor...</div>
        ) : offers.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Teklif bulunamadı.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {offersByPatient.map(({ patient, offers }) => {
              const patientId = patient?.id || 'deleted';
              const isExpanded = expandedPatientIds.includes(patientId);
              const totalAmountByCurrency: Record<string, number> = {};
              offers.forEach((offer: any) => {
                const currency = offer.currency || 'TRY';
                totalAmountByCurrency[currency] = (totalAmountByCurrency[currency] || 0) + (offer.totalPrice || 0);
              });
              return (
                <div key={patientId}>
                  <button
                    className="w-full flex items-center justify-between py-4 px-2 md:px-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition group"
                    onClick={() => togglePatientAccordion(patientId)}
                  >
                    <div className="flex items-center gap-3">
                      <FaUser className="text-blue-600" />
                      <span className="font-semibold text-lg text-gray-800">
                        {patient?.name || 'Bilinmeyen Hasta'}
                      </span>
                      {patient?.phone && (
                        <span className="text-gray-500 text-sm ml-2">{patient.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 bg-blue-100 rounded px-2 py-1">
                        {offers.length} teklif
                      </span>
                      <span className="text-sm text-gray-600 bg-green-100 rounded px-2 py-1">
                        {Object.entries(totalAmountByCurrency).map(([cur, amt]) => `${amt.toLocaleString('tr-TR')} ${cur}`).join(' + ')}
                      </span>
                      <span className="ml-2">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="py-2 px-2 md:px-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teklif</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksiyonlar</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {offers.map((offer) => (
                            <tr key={offer.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{offer.title}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                <PriceDisplay amount={offer.totalPrice || 0} currency={offer.currency || 'TRY'} />
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <select
                                  value={offer.status?.id || ''}
                                  onChange={async (e) => {
                                    try {
                                      const res = await fetch(`/api/offers/${offer.slug}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ statusId: e.target.value })
                                      });
                                      if (res.ok) {
                                        addToast({ message: 'Statü başarıyla güncellendi!', type: 'success' });
                                        // Teklifleri yeniden yükle
                                        fetchOffers(search, statusFilter, currencyFilter);
                                      } else {
                                        addToast({ message: 'Statü güncellenirken hata oluştu', type: 'error' });
                                      }
                                    } catch (error) {
                                      addToast({ message: 'Statü güncellenirken hata oluştu', type: 'error' });
                                    }
                                  }}
                                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full shadow-sm cursor-pointer border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(offer.status)}`}
                                >
                                  {statuses.map((status: any) => (
                                    <option key={status.id} value={status.id} className="bg-white text-gray-900">
                                      {status.displayName}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {new Date(offer.createdAt).toLocaleDateString('tr-TR')}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center gap-3">
                                  <Link 
                                    href={`/site/offer/${offer.slug}`}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Görüntüle"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaEye />
                                  </Link>
                                  <Link
                                    href={`/site/offers/${offer.slug}/edit`}
                                    className="text-yellow-600 hover:text-yellow-800"
                                    title="Düzenle"
                                  >
                                    <FaEdit />
                                  </Link>
                                  <button 
                                    onClick={() => copyLink(offer.slug)}
                                    className="text-green-600 hover:text-green-800"
                                    title="Link Kopyala"
                                    type="button"
                                  >
                                    <FaLink />
                                  </button>
                                  <button
                                    onClick={() => handleCreateReminder(offer.id, offer.title, patient?.name || 'Bilinmeyen Hasta')}
                                    className="text-purple-600 hover:text-purple-800"
                                    title="Hatırlatma Oluştur"
                                    type="button"
                                  >
                                    <FaBell />
                                  </button>
                                  <button 
                                    onClick={() => openDeleteDialog(offer.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Sil"
                                    type="button"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setOfferToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Teklifi Sil"
        message="Bu teklifi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        cancelText="İptal"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  )
} 