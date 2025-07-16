'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FaArrowLeft, FaSave, FaTrash, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa'

interface Patient {
  id: string
  name: string
  phone: string
  email?: string
}

interface ReferralSource {
  id: string
  name: string
  displayName: string
  color: string
  isActive: boolean
  order: number
}

interface TransferForm {
  [patientId: string]: string // patientId -> newSourceId
}

export default function TransferPatientsPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const sourceId = params.id as string

  const [transferForm, setTransferForm] = useState<TransferForm>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Silinecek kaynağı getir
  const { data: source, isLoading: sourceLoading } = useQuery({
    queryKey: ['referral-source', sourceId],
    queryFn: () => fetch(`/api/referral-sources/${sourceId}`).then(res => res.json())
  })

  // Bu kaynağa bağlı hastaları getir
  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ['patients-by-source', sourceId],
    queryFn: () => fetch(`/api/patients/by-source/${sourceId}`).then(res => res.json())
  })

  // Tüm kaynakları getir (hedef kaynaklar için)
  const { data: sources = [] } = useQuery({
    queryKey: ['referral-sources'],
    queryFn: () => fetch('/api/referral-sources').then(res => res.json())
  })

  // sources'ın array olduğundan emin ol
  const sourcesArray = Array.isArray(sources) ? sources : []

  // Hasta aktarma mutation'ı
  const transferMutation = useMutation({
    mutationFn: async (data: { patients: TransferForm }) => {
      return fetch('/api/patients/transfer-source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-sources'] })
      queryClient.invalidateQueries({ queryKey: ['patient-counts'] })
      setShowDeleteConfirm(true)
    }
  })

  // Kaynak silme mutation'ı
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return fetch('/api/referral-sources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sourceId })
      }).then(res => res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-sources'] })
      queryClient.invalidateQueries({ queryKey: ['patient-counts'] })
      router.push('/settings/referral-sources')
    }
  })

  // Hasta kaynağını değiştir
  const handlePatientSourceChange = (patientId: string, newSourceId: string) => {
    setTransferForm(prev => ({
      ...prev,
      [patientId]: newSourceId
    }))
  }

  // Toplu aktarma
  const handleTransfer = () => {
    const validTransfers = Object.entries(transferForm).filter(([_, sourceId]) => sourceId)
    
    if (validTransfers.length === 0) {
      alert('Lütfen en az bir hasta için yeni kaynak seçin')
      return
    }

    const transferData = Object.fromEntries(validTransfers)
    transferMutation.mutate({ patients: transferData })
  }

  // Kaynağı sil
  const handleDeleteSource = () => {
    deleteMutation.mutate()
  }

  if (sourceLoading || patientsLoading) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!source) {
    return (
      <div className="w-full">
        <div className="text-center py-12 text-red-500">
          Kaynak bulunamadı
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            <FaArrowLeft /> Geri
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Hasta Aktarma: {source.displayName}
            </h1>
            <p className="text-gray-600 mt-1">
              {patients.length} hasta bu kaynağa bağlı. Yeni kaynakları seçin ve aktarın.
            </p>
          </div>
        </div>
      </div>

      {/* Hasta Listesi */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Hastalar ({patients.length})
          </h2>
          <p className="text-gray-600 text-sm">
            Her hasta için yeni kaynak seçin. Seçilmeyen hastalar mevcut kaynakta kalacak.
          </p>
        </div>

        {patients.length === 0 ? (
          <div className="p-8 text-center">
            <FaUser className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Bu kaynağa bağlı hasta bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hasta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yeni Kaynak
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient: Patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FaUser className="text-sm" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patient.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 space-y-1">
                        {patient.phone && (
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-gray-400 text-xs" />
                            <span>{patient.phone}</span>
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400 text-xs" />
                            <span>{patient.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={transferForm[patient.id] || ''}
                        onChange={(e) => handlePatientSourceChange(patient.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Mevcut kaynakta kal</option>
                        {sourcesArray
                          .filter((s: ReferralSource) => s.id !== sourceId && s.isActive)
                          .sort((a: any, b: any) => a.order - b.order)
                          .map((s: ReferralSource) => (
                            <option key={s.id} value={s.id}>
                              {s.displayName}
                            </option>
                          ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Aksiyon Butonları */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          İptal
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={handleTransfer}
            disabled={transferMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FaSave className="text-sm" />
            {transferMutation.isPending ? 'Aktarılıyor...' : 'Hastaları Aktar'}
          </button>
        </div>
      </div>

      {/* Silme Onay Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Kaynağı Sil
            </h2>
            
            <p className="text-gray-700 mb-4">
              <strong>{source.displayName}</strong> kaynağını silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteSource}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 