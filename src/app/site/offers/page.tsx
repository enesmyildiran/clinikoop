"use client"

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FaPlus, FaFilePdf, FaSearch, FaEye, FaLink, FaTrash, FaUser, FaEdit, FaBell, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import PriceDisplay from '@/components/ui/PriceDisplay'
import { CurrencyCode } from '@/lib/currency'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { PageContainer } from '@/components/ui/PageContainer'

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
    <PageContainer>
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
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaSearch /> Ara
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Teklifler yükleniyor...</p>
        </div>
      ) : offersByPatient.length === 0 ? (
        <div className="text-center py-12">
          <FaFilePdf className="text-gray-400 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Henüz teklif bulunmuyor</p>
          <Link href="/site/offers/new" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaPlus /> İlk Teklifinizi Oluşturun
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {offersByPatient.map(({ patient, offers: patientOffers }) => (
            <div key={patient?.id || 'deleted'} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Hasta Başlığı */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {patient?.name || 'Silinmiş Hasta'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {patientOffers.length} teklif
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePatientAccordion(patient?.id || 'deleted')}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {expandedPatientIds.includes(patient?.id || 'deleted') ? (
                      <FaChevronUp className="w-5 h-5" />
                    ) : (
                      <FaChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Teklifler */}
              {expandedPatientIds.includes(patient?.id || 'deleted') && (
                <div className="divide-y divide-gray-200">
                  {patientOffers.map((offer) => (
                    <div key={offer.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-800">{offer.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                              {getStatusText(offer.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              <PriceDisplay 
                                amount={offer.totalAmount} 
                                currency={offer.currency as CurrencyCode} 
                              />
                            </span>
                            <span>Oluşturulma: {new Date(offer.createdAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/offer/${offer.slug}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Görüntüle"
                          >
                            <FaEye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/site/offers/${offer.id}/edit`}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <FaEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => copyLink(offer.slug)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Link Kopyala"
                          >
                            <FaLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCreateReminder(offer.id, offer.title, patient?.name || '')}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Hatırlatma Oluştur"
                          >
                            <FaBell className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteDialog(offer.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Silme Onay Dialog */}
              <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Teklifi Sil"
          message="Bu teklifi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
          confirmText="Sil"
          cancelText="İptal"
          isLoading={isDeleting}
          type="danger"
        />
    </PageContainer>
  )
} 