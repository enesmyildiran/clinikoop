import { FaClipboardList, FaDollarSign, FaChartLine, FaUsers } from 'react-icons/fa'
import { ReportSummary } from '@/types/report'
import { formatCurrencySymbol, CurrencyCode } from '@/lib/currency'

interface ReportSummaryCardsProps {
  summary?: ReportSummary
  loading?: boolean
  targetCurrency?: CurrencyCode
}

export default function ReportSummaryCards({ summary, loading, targetCurrency = 'TRY' }: ReportSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4 lg:p-6 animate-pulse">
            <div className="h-6 lg:h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 lg:h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Toplam Teklif',
      value: summary?.totalOffers || 0,
      icon: <FaClipboardList className="text-blue-500 text-xl lg:text-2xl" />,
      color: 'bg-blue-50',
      format: (value: number) => value.toString()
    },
    {
      title: `Toplam Satış (${targetCurrency})`,
      value: summary?.totalSales || 0,
      icon: <FaDollarSign className="text-green-500 text-xl lg:text-2xl" />,
      color: 'bg-green-50',
      format: (value: number) => formatCurrencySymbol(value, targetCurrency)
    },
    {
      title: 'Dönüşüm Oranı',
      value: summary?.conversionRate || 0,
      icon: <FaChartLine className="text-purple-500 text-xl lg:text-2xl" />,
      color: 'bg-purple-50',
      format: (value: number) => `${value.toFixed(1)}%`
    },
    {
      title: 'Aktif Hasta',
      value: summary?.totalOffers || 0, // Şimdilik teklif sayısı, gerçekte hasta sayısı olacak
      icon: <FaUsers className="text-orange-500 text-xl lg:text-2xl" />,
      color: 'bg-orange-50',
      format: (value: number) => value.toString()
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {cards.map((card, index) => (
        <div key={index} className={`${card.color} rounded-xl shadow p-4 lg:p-6 hover:shadow-lg transition-shadow`}>
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            {card.icon}
            <div className="text-right">
              <div className="text-lg lg:text-2xl font-bold text-gray-800">
                {card.format(card.value)}
              </div>
              <div className="text-xs lg:text-sm text-gray-600">{card.title}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 