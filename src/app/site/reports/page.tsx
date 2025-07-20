'use client'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import ReportFilters from './components/ReportFilters'
import ReportSummaryCards from './components/ReportSummaryCards'
import ReportCharts from './components/ReportCharts'
import { CurrencyCode } from '@/lib/currency'
import { PageContainer } from '@/components/ui/PageContainer'
import { useToast } from '@/components/ui/Toast'

const defaultFilters = {
  dateFrom: '', dateTo: '', currency: '', salesUserId: '', treatmentType: '', referralSourceId: '', page: 1, pageSize: 20
}

export default function ReportsPage() {
  const [filters, setFilters] = useState(defaultFilters)
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters)
  const { addToast } = useToast()

  const { data, isLoading, error } = useQuery({
    queryKey: ['reports', appliedFilters],
    queryFn: async () => {
      const response = await fetch('/api/reports', { 
        method: 'POST', 
        body: JSON.stringify(appliedFilters) 
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Rapor verileri alınamadı')
      }
      return response.json()
    }
  })

  // Error handling
  useEffect(() => {
    if (error) {
      addToast({
        message: error.message || 'Rapor verileri yüklenirken hata oluştu',
        type: 'error'
      })
    }
  }, [error, addToast])

  const handleApplyFilters = () => {
    setAppliedFilters(filters)
  }

  const targetCurrency = (appliedFilters.currency || 'TRY') as CurrencyCode

  return (
    <PageContainer>
      <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Raporlama</h1>
      <ReportFilters filters={filters} setFilters={setFilters} onApply={handleApplyFilters} />
      <ReportSummaryCards 
        summary={data?.summary} 
        loading={isLoading} 
        targetCurrency={targetCurrency}
      />
      <ReportCharts 
        offers={data?.offers} 
        loading={isLoading} 
        targetCurrency={targetCurrency}
      />
      {error && <div className="text-red-600 mt-4 p-4 bg-red-50 rounded-lg">Hata: {error.message}</div>}
    </PageContainer>
  )
} 