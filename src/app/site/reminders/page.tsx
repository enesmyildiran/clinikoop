"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FaPlus, FaFilter, FaCalendarAlt, FaUser, FaSort, FaBell, FaCheckCircle, FaClock, FaTimes, FaThumbtack } from 'react-icons/fa'
import ReminderCard from '@/components/ui/ReminderCard'
import { useReminders } from '@/contexts/ReminderContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { PageContainer } from '@/components/ui/PageContainer'

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
      if (statusFilter === 'completed') {
        filtered = filtered.filter(r => r.isCompleted)
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(r => !r.isCompleted)
      }
    }

    // Öncelik filtresi - Artık yok, kaldırıldı
    // if (priorityFilter) {
    //   filtered = filtered.filter(r => r.priority === priorityFilter)
    // }

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
            return dueDate < today && !r.isCompleted
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
          // Öncelik artık yok, sadece tarihe göre sırala
          aValue = new Date(a.dueDate)
          bValue = new Date(b.dueDate)
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
      pending: reminders.filter(r => !r.isCompleted).length,
      done: reminders.filter(r => r.isCompleted).length,
      postponed: 0, // Artık erteleme yok
      overdue: reminders.filter(r => new Date(r.dueDate) < new Date() && !r.isCompleted).length
    }
    return stats
  }

  const stats = getStatusStats()

  return (
    <PageContainer>
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
              className="flex items-center gap-2"
            >
              <FaFilter />
              {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Durum Filtresi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Durumlar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tüm Durumlar</SelectItem>
                    <SelectItem value="PENDING">Bekliyor</SelectItem>
                    <SelectItem value="DONE">Tamamlandı</SelectItem>
                    <SelectItem value="POSTPONED">Ertelendi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Öncelik Filtresi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                <Select value={priorityFilter} onValueChange={(value) => handleFilterChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Öncelikler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tüm Öncelikler</SelectItem>
                    <SelectItem value="URGENT">Acil</SelectItem>
                    <SelectItem value="HIGH">Yüksek</SelectItem>
                    <SelectItem value="MEDIUM">Orta</SelectItem>
                    <SelectItem value="LOW">Düşük</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tarih Filtresi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <Select value={dateFilter} onValueChange={(value) => handleFilterChange('date', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tüm Tarihler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tüm Tarihler</SelectItem>
                    <SelectItem value="today">Bugün</SelectItem>
                    <SelectItem value="tomorrow">Yarın</SelectItem>
                    <SelectItem value="thisWeek">Bu Hafta</SelectItem>
                    <SelectItem value="overdue">Geciken</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sıralama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                <Select value={sortBy} onValueChange={(value) => handleFilterChange('sort', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Vade Tarihi</SelectItem>
                    <SelectItem value="priority">Öncelik</SelectItem>
                    <SelectItem value="createdAt">Oluşturulma</SelectItem>
                    <SelectItem value="title">Başlık</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sıralama Yönü */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yön</label>
                <Select value={sortOrder} onValueChange={(value) => handleFilterChange('order', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Artan</SelectItem>
                    <SelectItem value="desc">Azalan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={clearFilters} variant="outline" className="mr-2">
                Filtreleri Temizle
              </Button>
              <Button onClick={updateURL}>
                Filtreleri Uygula
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
            <p className="mt-2 text-gray-600">Hatırlatmalar yükleniyor...</p>
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-600">Henüz hatırlatma bulunmuyor</p>
            <Button 
              onClick={() => router.push('/site/reminders/new')}
              className="mt-4"
            >
              İlk Hatırlatmanızı Oluşturun
            </Button>
          </div>
        ) : (
          filteredReminders.map((reminder) => (
            <ReminderCard 
              key={reminder.id} 
              reminder={reminder} 
              showActions={true}
            />
          ))
        )}
      </div>
    </PageContainer>
  )
} 