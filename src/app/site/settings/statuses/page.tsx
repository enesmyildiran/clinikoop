'use client'

import { useState, useEffect } from 'react'
import { FaTags, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaGripVertical, FaEye } from 'react-icons/fa'

interface OfferStatus {
  id: string
  name: string
  displayName: string
  color: string
  order: number
  isDefault: boolean
  isActive: boolean
}

export default function StatusesPage() {
  const [statuses, setStatuses] = useState<OfferStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingStatus, setEditingStatus] = useState<OfferStatus | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    color: '#6B7280',
    order: 0,
    isDefault: false,
    isActive: true
  })

  useEffect(() => {
    fetchStatuses()
  }, [])

  const fetchStatuses = async () => {
    try {
      const response = await fetch('/api/offer-statuses')
      const data = await response.json()
      if (data.success) {
        setStatuses(data.statuses)
      }
    } catch (error) {
      console.error('Durumlar yüklenirken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingStatus 
        ? `/api/offer-statuses/${editingStatus.id}`
        : '/api/offer-statuses'
      
      const method = editingStatus ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchStatuses()
        resetForm()
      } else {
        alert(data.message || 'Bir hata oluştu')
      }
    } catch (error) {
      console.error('Durum kaydedilirken hata:', error)
      alert('Bir hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu durumu silmek istediğinizden emin misiniz?')) return
    
    try {
      const response = await fetch(`/api/offer-statuses/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchStatuses()
      } else {
        alert(data.message || 'Silme işlemi başarısız')
      }
    } catch (error) {
      console.error('Durum silinirken hata:', error)
      alert('Bir hata oluştu')
    }
  }

  const handleEdit = (status: OfferStatus) => {
    setEditingStatus(status)
    setFormData({
      name: status.name,
      displayName: status.displayName,
      color: status.color,
      order: status.order,
      isDefault: status.isDefault,
      isActive: status.isActive
    })
  }

  const resetForm = () => {
    setEditingStatus(null)
    setIsCreating(false)
    setFormData({
      name: '',
      displayName: '',
      color: '#6B7280',
      order: 0,
      isDefault: false,
      isActive: true
    })
  }

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newStatuses = [...statuses]
    const [movedStatus] = newStatuses.splice(fromIndex, 1)
    newStatuses.splice(toIndex, 0, movedStatus)
    
    // Sıralamayı güncelle
    const updatedStatuses = newStatuses.map((status, index) => ({
      ...status,
      order: index
    }))
    
    setStatuses(updatedStatuses)
    
    // Her durumu güncelle
    try {
      await Promise.all(
        updatedStatuses.map(status =>
          fetch(`/api/offer-statuses/${status.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: status.order })
          })
        )
      )
    } catch (error) {
      console.error('Sıralama güncellenirken hata:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaTags className="text-emerald-600" />
          Teklif Durumları Yönetimi
        </h1>
        <p className="text-gray-600 mt-2">
          Teklif durumlarını özelleştirin ve pipeline sıralamasını ayarlayın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Görünümü */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Pipeline Sıralaması</h2>
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <FaPlus />
                Yeni Durum
              </button>
            </div>

            <div className="space-y-3">
              {statuses.map((status, index) => (
                <div
                  key={status.id}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FaGripVertical className="text-gray-400 cursor-move" />
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{status.displayName}</div>
                      <div className="text-sm text-gray-500">{status.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {status.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Varsayılan
                        </span>
                      )}
                      {!status.isActive && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          Pasif
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(status)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(status.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      disabled={status.isDefault}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingStatus ? 'Durumu Düzenle' : isCreating ? 'Yeni Durum' : 'Durum Ekle'}
          </h2>
          
          {(editingStatus || isCreating) ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum Adı (Teknik)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="draft"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Görünen Ad
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Taslak"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Renk
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="#6B7280"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sıra
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="0"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Varsayılan Durum</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <FaSave />
                  {editingStatus ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <FaTimes />
                  İptal
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <FaTags className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Yeni bir durum eklemek için "Yeni Durum" butonuna tıklayın
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mx-auto"
              >
                <FaPlus />
                Yeni Durum
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 