'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaChartLine, FaDollarSign, FaUsers, FaCheckCircle, FaArrowUp, FaArrowDown, FaCalendarAlt, FaFilter, FaLiraSign, FaEuroSign, FaPoundSign, FaInfoCircle, FaFileExport } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import { formatCurrencySymbol, CurrencyCode, DEFAULT_CURRENCY, CURRENCY_SYMBOLS } from '@/lib/currency'

interface PerformanceData {
  totalRevenue: number
  totalPatients: number
  totalOffers: number
  successRate: number
  monthlyData: Array<{
    month: string
    revenue: number
    patients: number
    offers: number
    successRate: number
  }>
  currencyDistribution: Array<{
    currency: string
    amount: number
    percentage: number
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

// Para birimi ikonları
const getCurrencyIcon = (currency: CurrencyCode) => {
  switch (currency) {
    case 'TRY':
      return <FaLiraSign className="text-green-500 text-2xl" />
    case 'USD':
      return <FaDollarSign className="text-green-500 text-2xl" />
    case 'EUR':
      return <FaEuroSign className="text-green-500 text-2xl" />
    case 'GBP':
      return <FaPoundSign className="text-green-500 text-2xl" />
    default:
      return <FaDollarSign className="text-green-500 text-2xl" />
  }
}

export default function PerformancePage() {
  const [timeRange, setTimeRange] = useState('month')
  const [targetCurrency, setTargetCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY)

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['performance', timeRange, targetCurrency],
    queryFn: async () => {
      const response = await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeRange, targetCurrency })
      })
      if (!response.ok) throw new Error('Performans verileri alınamadı')
      const result = await response.json()
      console.log('Performance API Response:', result) // Debug için
      return result
    },
    refetchInterval: 10000 // 10 saniyede bir canlı güncelle
  })

  const performanceStats = [
    { 
      label: 'Toplam Gelir', 
      value: data?.totalRevenue || 0, 
      change: '+12.5%', 
      trend: 'up' as const, 
      icon: getCurrencyIcon(targetCurrency),
      format: (val: number) => formatCurrencySymbol(val, targetCurrency)
    },
    { 
      label: 'Toplam Hasta', 
      value: data?.totalPatients || 0, 
      change: '+8.2%', 
      trend: 'up' as const, 
      icon: <FaUsers className="text-blue-500 text-2xl" />,
      format: (val: number) => val.toLocaleString('tr-TR')
    },
    { 
      label: 'Başarı Oranı', 
      value: data?.successRate || 0, 
      change: '+5.1%', 
      trend: 'up' as const, 
      icon: <FaCheckCircle className="text-indigo-500 text-2xl" />,
      format: (val: number) => `${val.toFixed(1)}%`
    },
    { 
      label: 'Ortalama Teklif', 
      value: data?.totalOffers ? (data.totalRevenue / data.totalOffers) : 0, 
      change: '-2.3%', 
      trend: 'down' as const, 
      icon: <FaChartLine className="text-orange-500 text-2xl" />,
      format: (val: number) => formatCurrencySymbol(val, targetCurrency)
    },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Gelir' ? 
                formatCurrencySymbol(entry.value, targetCurrency) : 
                entry.value.toLocaleString('tr-TR')
              }
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // En yüksek başarı oranı olan ayı bul
  const bestMonth = data?.monthlyData?.reduce((best: any, cur: any) => cur.successRate > (best?.successRate || 0) ? cur : best, null)

  // Export fonksiyonu (CSV)
  const exportCSV = () => {
    if (!data?.monthlyData?.length) return
    const header = 'Ay,Gelir,Hasta, Teklif,Başarı Oranı\n'
    const rows = data.monthlyData.map((m: any) => `${m.month},${m.revenue},${m.patients},${m.offers},${m.successRate.toFixed(1)}%`).join('\n')
    const csv = header + rows
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'aylik_performans.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 lg:p-6">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="text-red-600 p-4 bg-red-50 rounded-lg">
          Hata: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Başlık ve Filtreler */}
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">Satış Performansı</h1>
        
        {/* Filtreleme Alanı */}
        <div className="bg-white rounded-xl shadow p-4 lg:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filtreler</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zaman Aralığı</label>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" />
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="month">Bu Ay</option>
                  <option value="quarter">Bu Çeyrek</option>
                  <option value="year">Bu Yıl</option>
                  <option value="6months">Son 6 Ay</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <select 
                  value={targetCurrency} 
                  onChange={(e) => setTargetCurrency(e.target.value as CurrencyCode)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {performanceStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-4 lg:p-6 hover:shadow-lg transition-shadow relative">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <span>{stat.icon}</span>
              {/* Info tooltip */}
              <span className="ml-2 group relative">
                <FaInfoCircle className="text-gray-400 cursor-pointer" />
                <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none z-20">
                  {stat.label === 'Başarı Oranı' ? 'Onaylanan teklif / Toplam teklif' : stat.label}
                </span>
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.format(stat.value)}</div>
            <div className="flex items-center gap-2 text-sm">
              {stat.trend === 'up' ? <FaArrowUp className="text-green-500" /> : <FaArrowDown className="text-red-500" />}
              <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* En yüksek başarı oranı olan ay özeti */}
      {bestMonth && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <FaCheckCircle className="text-blue-500 text-2xl" />
            <span className="font-medium">En yüksek başarı oranı: <b>{bestMonth.month}</b> ({bestMonth.successRate.toFixed(1)}%)</span>
          </div>
        </div>
      )}

      {/* Çoklu Zaman Serisi Grafik */}
      <div className="bg-white rounded-xl shadow p-4 lg:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaChartLine className="text-blue-500" />
            Aylık Gelir, Hasta ve Teklif
          </h3>
          <span className="text-xs text-gray-500 flex items-center gap-2">
            {isFetching ? 'Veriler güncelleniyor...' : 'Veriler güncel'}
            <span className={isFetching ? 'animate-spin' : ''}><FaCheckCircle className="text-green-500" /></span>
          </span>
        </div>
        {(!data?.monthlyData || data.monthlyData.length === 0) ? (
          <div className="text-gray-400 text-center py-12">Veri bulunamadı</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data.monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" tickFormatter={v => formatCurrencySymbol(v, targetCurrency)} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={v => v.toLocaleString('tr-TR')} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="Gelir" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="patients" name="Hasta" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="offers" name="Teklif" stroke="#f59e42" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Tablo ve Export */}
      <div className="bg-white rounded-xl shadow p-4 lg:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaChartLine className="text-blue-500" />
            Aylık Detaylar
          </h3>
          <button onClick={exportCSV} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">
            <FaFileExport /> Export (CSV)
          </button>
        </div>
        {(!data?.monthlyData || data.monthlyData.length === 0) ? (
          <div className="text-gray-400 text-center py-12">Veri bulunamadı</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Ay</th>
                  <th className="px-4 py-2 text-left">Gelir</th>
                  <th className="px-4 py-2 text-left">Hasta</th>
                  <th className="px-4 py-2 text-left">Teklif</th>
                  <th className="px-4 py-2 text-left">Başarı Oranı</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyData.map((m: any) => (
                  <tr key={m.month} className="border-b">
                    <td className="px-4 py-2">{m.month}</td>
                    <td className="px-4 py-2">{formatCurrencySymbol(m.revenue, targetCurrency)}</td>
                    <td className="px-4 py-2">{m.patients}</td>
                    <td className="px-4 py-2">{m.offers}</td>
                    <td className="px-4 py-2">{m.successRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grafik Alanları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Gelir Grafiği */}
        <div className="bg-white rounded-xl shadow p-4 lg:p-6">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm lg:text-base">Aylık Gelir ({targetCurrency})</h3>
          <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
            <LineChart data={data?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Gelir" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Hasta Grafiği */}
        <div className="bg-white rounded-xl shadow p-4 lg:p-6">
          <h3 className="font-semibold text-gray-700 mb-4 text-sm lg:text-base">Hasta ve Teklif Sayısı</h3>
          <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
            <BarChart data={data?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="patients" fill="#3b82f6" name="Hasta" />
              <Bar dataKey="offers" fill="#f59e0b" name="Teklif" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Para Birimi Dağılımı */}
      {data?.currencyDistribution && data.currencyDistribution.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl shadow p-4 lg:p-6">
            <h3 className="font-semibold text-gray-700 mb-4 text-sm lg:text-base">Para Birimi Dağılımı</h3>
            <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
              <PieChart>
                <Pie
                  data={data.currencyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props.currency} ${props.percentage.toFixed(1)}%`}
                  outerRadius={60}
                  className="lg:outerRadius-80"
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {data.currencyDistribution.map((entry: { currency: string; amount: number; percentage: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detaylı Tablo */}
      <div className="bg-white rounded-xl shadow p-4 lg:p-6">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm lg:text-base">Aylık Performans Detayları</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase">Ay</th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase">Gelir ({targetCurrency})</th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase">Hasta</th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase">Teklif</th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase">Başarı Oranı</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.monthlyData?.map((data: { month: string; revenue: number; patients: number; offers: number; successRate: number }, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-gray-900">{data.month}</td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                    {formatCurrencySymbol(data.revenue, targetCurrency)}
                  </td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{data.patients}</td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{data.offers}</td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {data.successRate.toFixed(1)}%
                    </span>
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