import Link from 'next/link'
import { FaPlus, FaFilePdf, FaEye, FaEdit, FaTrash, FaDownload, FaShare } from 'react-icons/fa'
import PriceDisplay from '@/components/ui/PriceDisplay'
import { CurrencyCode } from '@/lib/currency'

const allOffers = [
  { 
    id: '1', 
    patient: 'Ahmet Yılmaz', 
    title: 'İmplant Teklifi', 
    price: 12000, 
    currency: 'EUR' as CurrencyCode,
    status: 'SENT', 
    date: '2024-06-01',
    createdBy: 'Dr. Smith',
    views: 15,
    downloads: 3
  },
  { 
    id: '2', 
    patient: 'Ayşe Demir', 
    title: 'Diş Beyazlatma', 
    price: 3500, 
    currency: 'USD' as CurrencyCode,
    status: 'ACCEPTED', 
    date: '2024-05-28',
    createdBy: 'Sales Manager',
    views: 8,
    downloads: 2
  },
  { 
    id: '3', 
    patient: 'Mehmet Kaya', 
    title: 'Ortodonti', 
    price: 18000, 
    currency: 'TRY' as CurrencyCode,
    status: 'DRAFT', 
    date: '2024-05-20',
    createdBy: 'Dr. Johnson',
    views: 5,
    downloads: 1
  },
  { 
    id: '4', 
    patient: 'Fatma Öz', 
    title: 'Diş Dolgusu', 
    price: 800, 
    currency: 'TRY' as CurrencyCode,
    status: 'REJECTED', 
    date: '2024-05-15',
    createdBy: 'Assistant',
    views: 12,
    downloads: 0
  },
  { 
    id: '5', 
    patient: 'Ali Veli', 
    title: 'Kanal Tedavisi', 
    price: 2500, 
    currency: 'USD' as CurrencyCode,
    status: 'PENDING', 
    date: '2024-06-05',
    createdBy: 'Dr. Smith',
    views: 20,
    downloads: 5
  },
]

export default function AllOffersPage() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tüm Teklifler</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-green-100 text-green-600 font-medium hover:bg-green-200">
            <FaDownload className="inline mr-2" />
            Toplu İndir
          </button>
          <Link href="/offers/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
            <FaPlus /> Yeni Teklif
          </Link>
        </div>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Teklif ara..." 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 font-medium">Tümü</button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200">Gönderildi</button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200">Kabul Edildi</button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200">Taslak</button>
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200">Reddedildi</button>
          </div>
        </div>
      </div>

      {/* Teklif Listesi */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teklif</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oluşturan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İstatistikler</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{offer.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <PriceDisplay amount={offer.price} currency={offer.currency} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      offer.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                      offer.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      offer.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                      offer.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      offer.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {offer.status === 'SENT' ? 'Gönderildi' : 
                       offer.status === 'ACCEPTED' ? 'Kabul Edildi' : 
                       offer.status === 'DRAFT' ? 'Taslak' : 
                       offer.status === 'REJECTED' ? 'Reddedildi' : 
                       offer.status === 'PENDING' ? 'Beklemede' : offer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{offer.createdBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>👁️ {offer.views} görüntüleme</div>
                      <div>📥 {offer.downloads} indirme</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Görüntüle">
                        <FaEye />
                      </button>
                      <button className="text-green-600 hover:text-green-800" title="PDF İndir">
                        <FaFilePdf />
                      </button>
                      <button className="text-purple-600 hover:text-purple-800" title="Paylaş">
                        <FaShare />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-800" title="Düzenle">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Sil">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 