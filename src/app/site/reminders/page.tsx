"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FaPlus, FaFilter, FaCalendarAlt, FaUser, FaSort, FaBell, FaCheckCircle, FaClock, FaTimes, FaThumbtack } from 'react-icons/fa'
import ReminderCard from '@/components/ui/ReminderCard'
import { useReminders } from '@/contexts/ReminderContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'

export default function RemindersPage() {
  const { reminders, pinnedReminders, loading, refreshReminders } = useReminders()
  const [filteredReminders, setFilteredReminders] = useState(reminders)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filtre state'leri
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [sortBy, setSortBy] = useState('dueDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // URL'den filtreleri al
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const date = searchParams.get('date') || ''
    const sort = searchParams.get('sort') || 'dueDate'
    const order = (searchParams.get('order') as 'asc' | 'desc') || 'asc'
    
    setStatusFilter(status)
    setPriorityFilter(priority)
    setDateFilter(date)
    setSortBy(sort)
    setSortOrder(order)
  }, [searchParams])

  useEffect(() => {
    applyFilters()
  }, [reminders, statusFilter, priorityFilter, dateFilter, sortBy, sortOrder])

  const applyFilters = () => {
    let filtered = [...reminders]

    // Durum filtresi
    if (statusFilter) {
      filtered = filtered.filter(r => r.status === statusFilter)
    }

    // Öncelik filtresi
    if (priorityFilter) {
      filtered = filtered.filter(r => r.priority === priorityFilter)
    }

    // Tarih filtresi
    if (dateFilter) {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(r => {
            const dueDate = new Date(r.dueDate)
            return dueDate.toDateString() === today.toDateString()
          })
          break
        case 'tomorrow':
          filtered = filtered.filter(r => {
            const dueDate = new Date(r.dueDate)
            return dueDate.toDateString() === tomorrow.toDateString()
          })
          break
        case 'thisWeek':
          filtered = filtered.filter(r => {
            const dueDate = new Date(r.dueDate)
            return dueDate >= today && dueDate <= nextWeek
          })
          break
        case 'overdue':
          filtered = filtered.filter(r => {
            const dueDate = new Date(r.dueDate)
            return dueDate < today && r.status === 'PENDING'
          })
          break
      }
    }

    // Sıralama - Sabitlenmiş hatırlatmalar her zaman üstte
    filtered.sort((a, b) => {
      // Önce sabitleme durumuna göre sırala
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Sonra diğer kriterlere göre sırala
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'dueDate':
          aValue = new Date(a.dueDate)
          bValue = new Date(b.dueDate)
          break
        case 'priority':
          const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder]
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder]
          break
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          aValue = a.title
          bValue = b.title
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredReminders(filtered)
  }

  const updateURL = () => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (priorityFilter) params.set('priority', priorityFilter)
    if (dateFilter) params.set('date', dateFilter)
    if (sortBy) params.set('sort', sortBy)
    if (sortOrder) params.set('order', sortOrder)
    
    router.replace(`/reminders${params.toString() ? `?${params}` : ''}`)
  }

  const handleFilterChange = (type: string, value: string) => {
    switch (type) {
      case 'status':
        setStatusFilter(value)
        break
      case 'priority':
        setPriorityFilter(value)
        break
      case 'date':
        setDateFilter(value)
        break
      case 'sort':
        setSortBy(value)
        break
      case 'order':
        setSortOrder(value as 'asc' | 'desc')
        break
    }
  }

  const clearFilters = () => {
    setStatusFilter('')
    setPriorityFilter('')
    setDateFilter('')
    setSortBy('dueDate')
    setSortOrder('asc')
    router.replace('/reminders')
  }

  const getStatusStats = () => {
    const stats = {
      pending: reminders.filter(r => r.status === 'PENDING').length,
      done: reminders.filter(r => r.status === 'DONE').length,
      postponed: reminders.filter(r => r.status === 'POSTPONED').length,
      overdue: reminders.filter(r => new Date(r.dueDate) < new Date() && r.status === 'PENDING').length
    }
    return stats
  }

  const stats = getStatusStats()

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hatırlatmalar</h1>
          <p className="text-gray-600">Tüm hatırlatmalarınızı merkezi olarak yönetin</p>
        </div>
        <Button 
          onClick={() => router.push('/site/reminders/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FaPlus className="mr-2" />
          Yeni Hatırlatma
        </Button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center">
            <FaClock className="text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Bekleyen</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Tamamlanan</p>
              <p className="text-2xl font-bold text-gray-800">{stats.done}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center">
            <FaCalendarAlt className="text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Ertelenen</p>
              <p className="text-2xl font-bold text-gray-800">{stats.postponed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center">
            <FaTimes className="text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Geciken</p>
              <p className="text-2xl font-bold text-gray-800">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Filtreler ve Sıralama</h2>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
            >
              <FaFilter className="mr-2" />
              {showFilters ? 'Gizle' : 'Göster'}
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <Select value={statusFilter || "all"} onValueChange={(value) => handleFilterChange('status', value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Durumlar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="PENDING">Bekliyor</SelectItem>
                    <SelectItem value="DONE">Tamamlandı</SelectItem>
                    <SelectItem value="POSTPONED">Ertelendi</SelectItem>
                    <SelectItem value="CLOSED_WITH_REASON">Kapatıldı</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                <Select value={priorityFilter || "all"} onValueChange={(value) => handleFilterChange('priority', value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Öncelikler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Öncelikler</SelectItem>
                    <SelectItem value="URGENT">Acil</SelectItem>
                    <SelectItem value="HIGH">Yüksek</SelectItem>
                    <SelectItem value="MEDIUM">Orta</SelectItem>
                    <SelectItem value="LOW">Düşük</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <Select value={dateFilter || "all"} onValueChange={(value) => handleFilterChange('date', value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Tarihler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Tarihler</SelectItem>
                    <SelectItem value="today">Bugün</SelectItem>
                    <SelectItem value="tomorrow">Yarın</SelectItem>
                    <SelectItem value="thisWeek">Bu Hafta</SelectItem>
                    <SelectItem value="overdue">Geciken</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                <Select value={sortBy} onValueChange={(value) => handleFilterChange('sort', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sıralama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Tarih</SelectItem>
                    <SelectItem value="priority">Öncelik</SelectItem>
                    <SelectItem value="createdAt">Oluşturma</SelectItem>
                    <SelectItem value="title">Başlık</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sıra:</label>
                <Button
                  onClick={() => handleFilterChange('order', sortOrder === 'asc' ? 'desc' : 'asc')}
                  variant="outline"
                  size="sm"
                >
                  <FaSort className="mr-1" />
                  {sortOrder === 'asc' ? 'Artan' : 'Azalan'}
                </Button>
              </div>
              
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Filtreleri Temizle
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sabitlenmiş Hatırlatmalar */}
      {pinnedReminders.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaThumbtack className="text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-800">Sabitlenmiş Hatırlatmalar</h2>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {pinnedReminders.length}
            </span>
          </div>
          <div className="grid gap-4">
            {pinnedReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                showActions={true}
                className="border-yellow-300 bg-yellow-50"
              />
            ))}
          </div>
        </div>
      )}

      {/* Hatırlatma Listesi */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Hatırlatmalar yükleniyor...</p>
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {reminders.length === 0 ? 'Henüz hatırlatmanız yok!' : 'Filtrelere uygun hatırlatma bulunamadı'}
            </h3>
            <p className="text-gray-600 mb-6">
              {reminders.length === 0 
                ? 'İlk hatırlatmanızı oluşturarak başlayın'
                : 'Filtrelerinizi değiştirerek daha fazla sonuç görebilirsiniz'
              }
            </p>
            <Button 
              onClick={() => router.push('/site/reminders/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FaPlus className="mr-2" />
              Yeni Hatırlatma Ekle
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {filteredReminders.length} hatırlatma gösteriliyor
              </p>
              <Button
                onClick={refreshReminders}
                variant="outline"
                size="sm"
              >
                Yenile
              </Button>
            </div>
            
            <div className="grid gap-4">
              {filteredReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  showActions={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
} 