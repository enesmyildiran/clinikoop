import { CURRENCY_OPTIONS } from '@/lib/currency'
import { FaFilter, FaSearch } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'

interface ReportFiltersProps {
  filters: {
    dateFrom: string
    dateTo: string
    currency: string
    salesUserId: string
    treatmentType: string
    referralSourceId: string
    page: number
    pageSize: number
  }
  setFilters: React.Dispatch<React.SetStateAction<{
    dateFrom: string
    dateTo: string
    currency: string
    salesUserId: string
    treatmentType: string
    referralSourceId: string
    page: number
    pageSize: number
  }>>
  onApply?: () => void
}

export default function ReportFilters({ filters, setFilters, onApply }: ReportFiltersProps) {
  const { data: sources = [] } = useQuery({
    queryKey: ['referral-sources'],
    queryFn: () => fetch('/api/referral-sources').then(res => res.json())
  })

  const sourcesArray = Array.isArray(sources) ? sources : []

  return (
    <div className="bg-white rounded-xl shadow p-4 lg:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FaFilter className="text-blue-600" />
        <h3 className="text-base lg:text-lg font-semibold text-gray-800">Filtreler</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1">Tarih Aralığı</label>
          <div className="flex gap-2">
            <input 
              type="date" 
              value={filters.dateFrom} 
              onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} 
              className="flex-1 px-2 lg:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs lg:text-sm"
            />
            <input 
              type="date" 
              value={filters.dateTo} 
              onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} 
              className="flex-1 px-2 lg:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs lg:text-sm"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
          <select 
            value={filters.currency} 
            onChange={e => setFilters(f => ({ ...f, currency: e.target.value }))} 
            className="w-full px-2 lg:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs lg:text-sm"
          >
            <option value="">Tümü</option>
            {CURRENCY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1">Satışçı</label>
          <input 
            type="text" 
            value={filters.salesUserId} 
            onChange={e => setFilters(f => ({ ...f, salesUserId: e.target.value }))} 
            className="w-full px-2 lg:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs lg:text-sm"
            placeholder="Satışçı adı"
          />
        </div>
        
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1">Tedavi Türü</label>
          <input 
            type="text" 
            value={filters.treatmentType} 
            onChange={e => setFilters(f => ({ ...f, treatmentType: e.target.value }))} 
            className="w-full px-2 lg:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs lg:text-sm"
            placeholder="Tedavi türü"
          />
        </div>
        
        <div>
          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1">Hasta Kaynağı</label>
          <select 
            value={filters.referralSourceId} 
            onChange={e => setFilters(f => ({ ...f, referralSourceId: e.target.value }))} 
            className="w-full px-2 lg:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs lg:text-sm"
          >
            <option value="">Tümü</option>
            {sourcesArray
              .filter((source: any) => source.isActive)
              .sort((a: any, b: any) => a.order - b.order)
              .map((source: any) => (
                <option key={source.id} value={source.id}>
                  {source.displayName}
                </option>
              ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={onApply} 
          className="flex items-center gap-2 px-4 lg:px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm lg:text-base"
        >
          <FaSearch className="text-sm" />
          Filtrele
        </button>
      </div>
    </div>
  )
} 