'use client'

import { useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface ReferralSource {
  id: string
  name: string
  displayName: string
  description?: string
  color: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ReferralSourceForm {
  name: string
  displayName: string
  description: string
  color: string
  order: number
  isActive: boolean
}

const defaultForm: ReferralSourceForm = {
  name: '',
  displayName: '',
  description: '',
  color: '#6B7280',
  order: 0,
  isActive: true
}

export default function ReferralSourcesPage() {
  const [form, setForm] = useState<ReferralSourceForm>(defaultForm)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string; patients: any[] } | null>(null)
  const queryClient = useQueryClient()

  // Kaynakları getir
  const { data: sources = [], isLoading } = useQuery({
    queryKey: ['referral-sources'],
    queryFn: () => fetch('/api/referral-sources').then(res => res.json())
  })

  // sources'ın array olduğundan emin ol
  const sourcesArray = Array.isArray(sources) ? sources : []

  // Hasta sayılarını getir
  const { data: patientCounts = {} } = useQuery({
    queryKey: ['patient-counts'],
    queryFn: async () => {
      const response = await fetch('/api/patients/counts-by-source')
      return response.json()
    }
  })

  // Kaynak ekle/güncelle
  const mutation = useMutation({
    mutationFn: (data: ReferralSourceForm & { id?: string }) => {
      const method = data.id ? 'PUT' : 'POST'
      return fetch('/api/referral-sources', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-sources'] })
      queryClient.invalidateQueries({ queryKey: ['patient-counts'] })
      setIsModalOpen(false)
      setForm(defaultForm)
      setEditingId(null)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = editingId ? { ...form, id: editingId } : form
    mutation.mutate(data)
  }

  const handleEdit = (source: ReferralSource) => {
    setForm({
      name: source.name,
      displayName: source.displayName,
      description: source.description || '',
      color: source.color,
      order: source.order,
      isActive: source.isActive
    })
    setEditingId(source.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string, name: string, patientCount: number) => {
    if (patientCount > 0) {
      // Hasta aktarma sayfasına yönlendir
      window.location.href = `/settings/referral-sources/${id}/transfer`
    } else {
      // Direkt silme onayı göster
      setDeleteConfirm({ id, name, patients: [] })
    }
  }

  const resetForm = () => {
    setForm(defaultForm)
    setEditingId(null)
    setIsModalOpen(false)
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return
    
    try {
      const response = await fetch('/api/referral-sources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteConfirm.id })
      })
      
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['referral-sources'] })
        queryClient.invalidateQueries({ queryKey: ['patient-counts'] })
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Silme hatası:', error)
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hasta Kaynakları</h1>
          <p className="text-gray-600 mt-1">Hasta kaynaklarını yönetin ve organize edin</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="text-sm" />
          Yeni Kaynak
        </button>
      </div>

      {/* Kaynak Listesi */}
      <div className="bg-white rounded-xl shadow">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Kaynaklar yükleniyor...</p>
          </div>
        ) : sourcesArray.length === 0 ? (
          <div className="p-8 text-center">
            <FaEye className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Henüz kaynak eklenmemiş</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              İlk Kaynağı Ekle
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kaynak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sıra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hasta Sayısı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sourcesArray.map((source: ReferralSource) => (
                  <tr key={source.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-gray-200"
                          style={{ backgroundColor: source.color }}
                        ></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {source.displayName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {source.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {source.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {source.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (patientCounts[source.id] || 0) > 0 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patientCounts[source.id] || 0} hasta
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        source.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {source.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(source)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(source.id, source.displayName, patientCounts[source.id] || 0)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title={(patientCounts[source.id] || 0) > 0 ? 'Hasta aktarma sayfasına git' : 'Kaynağı sil'}
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ekleme/Düzenleme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Kaynak Düzenle' : 'Yeni Kaynak Ekle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kaynak Adı (Teknik)
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="google, instagram, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Görünen Ad
                </label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setForm({...form, displayName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Google Arama, Instagram, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Kaynak hakkında açıklama..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Renk
                  </label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({...form, color: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({...form, order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({...form, isActive: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Aktif
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {mutation.isPending ? 'Kaydediliyor...' : (editingId ? 'Güncelle' : 'Ekle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Silme Onay Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Kaynağı Sil
            </h2>
            
            <p className="text-gray-700 mb-4">
              <strong>{deleteConfirm.name}</strong> kaynağını silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tamam
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 