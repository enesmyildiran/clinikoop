import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { formatCurrencySymbol, CurrencyCode } from '@/lib/currency'
import { useQuery } from '@tanstack/react-query'

interface ReportChartsProps {
  offers?: any[]
  loading?: boolean
  targetCurrency?: CurrencyCode
}

// Pie chart için renkler
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'];

export default function ReportCharts({ offers = [], loading, targetCurrency = 'TRY' }: ReportChartsProps) {
  // Kaynakları getir
  const { data: sources = [] } = useQuery({
    queryKey: ['referral-sources'],
    queryFn: () => fetch('/api/referral-sources').then(res => res.json())
  })

  // sources'ın array olduğundan emin ol
  const sourcesArray = Array.isArray(sources) ? sources : []

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4 lg:p-6 animate-pulse">
            <div className="h-4 lg:h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-48 lg:h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="text-center text-gray-500">Grafik verisi bulunamadı</div>
      </div>
    )
  }

  // Aylık satış verileri
  const monthlyData: Record<string, { month: string; sales: number; count: number }> = offers.reduce((acc, offer) => {
    const date = new Date(offer.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, sales: 0, count: 0 }
    }
    
    if (offer.status === 'accepted') {
      const amount = offer.convertedAmount || offer.amount
      acc[monthKey].sales += Math.round(amount * 100) / 100
    }
    acc[monthKey].count += 1
    
    return acc
  }, {} as Record<string, { month: string; sales: number; count: number }>)

  const monthlyChartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))

  // Para birimi dağılımı
  const currencyData: Record<string, { currency: string; total: number; count: number }> = offers.reduce((acc, offer) => {
    const currency = offer.currency || 'TRY'
    if (!acc[currency]) {
      acc[currency] = { currency, total: 0, count: 0 }
    }
    const amount = offer.convertedAmount || offer.amount
    acc[currency].total += Math.round(amount * 100) / 100
    acc[currency].count += 1
    return acc
  }, {} as Record<string, { currency: string; total: number; count: number }>)

  const currencyChartData = Object.values(currencyData)

  // Hasta kaynağı dağılımı
  const sourceData: Record<string, { source: string; count: number; total: number }> = offers.reduce((acc, offer) => {
    const source = offer.patient?.referralSourceId || 'unknown'
    if (!acc[source]) {
      acc[source] = { source, count: 0, total: 0 }
    }
    acc[source].count += 1
    const amount = offer.convertedAmount || offer.amount
    acc[source].total += Math.round(amount * 100) / 100
    return acc
  }, {} as Record<string, { source: string; count: number; total: number }>)

  const sourceChartData = Object.values(sourceData).map(item => ({
    ...item,
    name: sourcesArray.find((s: any) => s.id === item.source)?.displayName || item.source,
    value: item.count
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Satış' || entry.name === 'Toplam' ? 
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

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: payload[0].color }}>
            Hasta Sayısı: {data.value}
          </p>
          <p style={{ color: payload[0].color }}>
            Toplam Değer: {formatCurrencySymbol(data.total, targetCurrency)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      <div className="bg-white rounded-xl shadow p-4 lg:p-6">
        <h3 className="text-sm lg:text-lg font-semibold mb-4">Aylık Satış Trendi ({targetCurrency})</h3>
        <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
          <LineChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} name="Satış" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow p-4 lg:p-6">
        <h3 className="text-sm lg:text-lg font-semibold mb-4">Para Birimi Dağılımı ({targetCurrency})</h3>
        <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
          <BarChart data={currencyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="currency" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#3b82f6" name="Toplam" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow p-4 lg:p-6">
        <h3 className="text-sm lg:text-lg font-semibold mb-4">Hasta Kaynağı Dağılımı</h3>
        <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
          <PieChart>
            <Pie
              data={sourceChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {sourceChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 