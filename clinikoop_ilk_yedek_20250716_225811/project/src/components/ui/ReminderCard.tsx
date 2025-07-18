'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaCheck, FaCalendar, FaTimes, FaEdit, FaTrash, FaBell, FaUser, FaFileAlt, FaThumbtack } from 'react-icons/fa'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { useReminders } from '@/contexts/ReminderContext'
import { useToast } from '@/components/ui/Toast'

interface ReminderCardProps {
  reminder: {
    id: string
    title: string
    description?: string
    dueDate: string
    status: 'PENDING' | 'DONE' | 'POSTPONED' | 'CLOSED_WITH_REASON'
    reason?: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    isPrivate: boolean
    patient?: {
      id: string
      name: string
      phone: string
    }
    offer?: {
      id: string
      title: string
    }
    isPinned: boolean
  }
  showActions?: boolean
  className?: string
}

export default function ReminderCard({ reminder, showActions = true, className = '' }: ReminderCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [showPostponeModal, setShowPostponeModal] = useState(false)
  const [reason, setReason] = useState('')
  const [postponeTime, setPostponeTime] = useState('10')
  const [customDays, setCustomDays] = useState('')
  const [customHours, setCustomHours] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { markAsDone, postponeReminder, closeWithReason, updateReminder, deleteReminder, togglePinned } = useReminders()
  const { addToast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'DONE': return 'bg-green-100 text-green-800'
      case 'POSTPONED': return 'bg-blue-100 text-blue-800'
      case 'CLOSED_WITH_REASON': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-600'
      case 'MEDIUM': return 'bg-blue-100 text-blue-600'
      case 'HIGH': return 'bg-orange-100 text-orange-600'
      case 'URGENT': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Bekliyor'
      case 'DONE': return 'Tamamlandı'
      case 'POSTPONED': return 'Ertelendi'
      case 'CLOSED_WITH_REASON': return 'Kapatıldı'
      default: return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'Düşük'
      case 'MEDIUM': return 'Orta'
      case 'HIGH': return 'Yüksek'
      case 'URGENT': return 'Acil'
      default: return priority
    }
  }

  const handleMarkAsDone = async () => {
    await markAsDone(reminder.id)
  }

  const handlePostpone = async () => {
    setShowPostponeModal(true)
  }

  const handlePostponeConfirm = async () => {
    let minutes: number
    if (postponeTime === 'custom') {
      const days = parseInt(customDays) || 0
      const hours = parseInt(customHours) || 0
      
      if (days === 0 && hours === 0) {
        addToast({
          message: 'Lütfen en az 1 saat girin',
          type: 'error'
        })
        return
      }
      
      minutes = (days * 24 * 60) + (hours * 60)
    } else {
      minutes = parseInt(postponeTime)
    }

    const newDate = new Date()
    newDate.setMinutes(newDate.getMinutes() + minutes)
    
    await postponeReminder(reminder.id, newDate.toISOString())
    setShowPostponeModal(false)
    setPostponeTime('10')
    setCustomDays('')
    setCustomHours('')
    
    const timeText = postponeTime === 'custom' 
      ? `${customDays ? customDays + ' gün ' : ''}${customHours ? customHours + ' saat' : ''}`.trim()
      : `${minutes} dakika`
    
    addToast({
      message: `Hatırlatma ${timeText} ertelendi`,
      type: 'success'
    })
  }

  const handleCloseWithReason = async () => {
    if (reason.trim()) {
      await closeWithReason(reminder.id, reason.trim())
      setShowReasonModal(false)
      setReason('')
    }
  }

  const handleDelete = async () => {
    if (confirm('Bu hatırlatmayı silmek istediğinizden emin misiniz?')) {
      await deleteReminder(reminder.id)
    }
  }

  const handleTogglePinned = async () => {
    if (isProcessing) return // Çoklu tıklamayı engelle
    
    setIsProcessing(true)
    try {
      await togglePinned(reminder.id)
      addToast({
        message: 'Hatırlatma durumu güncellendi',
        type: 'success'
      })
    } catch (error) {
      addToast({
        message: 'Bir hata oluştu',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const isOverdue = new Date(reminder.dueDate) < new Date() && reminder.status === 'PENDING'

  return (
    <>
      <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative ${isOverdue ? 'border-red-300 bg-red-50' : ''} ${reminder.isPinned ? 'border-yellow-300 bg-yellow-50' : ''} ${className}`}>
        {/* Sabitleme İkonu - Sağ Üst */}
        {reminder.isPinned && (
          <div className="absolute top-2 right-2">
            <FaThumbtack className="w-4 h-4 text-yellow-600" title="Sabitlenmiş" />
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FaBell className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-blue-500'}`} />
              <Link href={`/reminders/${reminder.id}`} className="font-medium text-gray-900 hover:underline">
                {reminder.title}
              </Link>
            </div>
            {reminder.description && (
              <Link href={`/reminders/${reminder.id}`} className="text-sm text-gray-600 mb-2 block hover:underline">
                {reminder.description}
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
              {getStatusText(reminder.status)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
              {getPriorityText(reminder.priority)}
            </span>
          </div>
        </div>

        {/* İlişkili Bilgiler */}
        <div className="space-y-2 mb-3">
          {reminder.patient && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaUser className="w-3 h-3" />
              <span>Hasta: </span>
              <Link 
                href={`/patients/${reminder.patient.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {reminder.patient.name}
              </Link>
            </div>
          )}
          {reminder.offer && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaFileAlt className="w-3 h-3" />
              <span>Teklif: {reminder.offer.title}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaCalendar className="w-3 h-3" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {new Date(reminder.dueDate).toLocaleString('tr-TR')}
              {isOverdue && ' (Gecikmiş)'}
            </span>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        {showActions && reminder.status === 'PENDING' && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
            <Button
              onClick={handleMarkAsDone}
              size="sm"
              className="inline-flex items-center justify-center gap-1 min-w-[110px] h-9 px-3 text-sm bg-green-600 hover:bg-green-700 text-white"
            >
              <FaCheck className="w-3 h-3" />
              Tamamla
            </Button>
            <Button
              onClick={handlePostpone}
              size="sm"
              variant="outline"
              className="inline-flex items-center justify-center gap-1 min-w-[110px] h-9 px-3 text-sm border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <FaCalendar className="w-3 h-3" />
              Ertele
            </Button>
            <Button
              onClick={() => setShowReasonModal(true)}
              size="sm"
              variant="outline"
              className="inline-flex items-center justify-center gap-1 min-w-[110px] h-9 px-3 text-sm border-red-300 text-red-600 hover:bg-red-50"
            >
              <FaTimes className="w-3 h-3" />
              Kapat
            </Button>
            <Button
              onClick={handleTogglePinned}
              disabled={isProcessing}
              size="sm"
              variant="outline"
              className={`inline-flex items-center justify-center gap-1 min-w-[110px] h-9 px-3 text-sm ${reminder.isPinned ? 'border-yellow-300 text-yellow-600 hover:bg-yellow-50 bg-yellow-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaThumbtack className={`w-3 h-3 ${reminder.isPinned ? 'text-yellow-600' : 'text-gray-500'}`} />
              {reminder.isPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
            </Button>
            <Link
              href={`/reminders/${reminder.id}/edit`}
              className="inline-flex items-center justify-center gap-1 min-w-[110px] h-9 px-3 text-sm border border-yellow-300 text-yellow-600 rounded hover:bg-yellow-50"
            >
              <FaEdit className="w-3 h-3" /> Düzenle
            </Link>
            <Button
              onClick={handleDelete}
              size="sm"
              variant="outline"
              className="inline-flex items-center justify-center gap-1 min-w-[110px] h-9 px-3 text-sm border-red-300 text-red-600 hover:bg-red-50"
            >
              <FaTrash className="w-3 h-3" />
              Sil
            </Button>
          </div>
        )}

        {/* Kapatma Sebebi */}
        {reminder.reason && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
            <span className="font-medium text-gray-700">Kapatma Sebebi:</span>
            <p className="text-gray-600 mt-1">{reminder.reason}</p>
          </div>
        )}
      </div>

      {/* Sebep Girme Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Hatırlatmayı Kapat</h3>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Kapatma sebebini girin..."
              className="mb-4"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setShowReasonModal(false)
                  setReason('')
                }}
                variant="outline"
              >
                İptal
              </Button>
              <Button
                onClick={handleCloseWithReason}
                disabled={!reason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Kapat
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Erteleme Modal */}
      {showPostponeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hatırlatmayı Ertele</h3>
            <p className="text-sm text-gray-600 mb-4">
              "{reminder.title}" hatırlatmasını ne kadar ertelemek istiyorsunuz?
            </p>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postponeTime"
                  value="10"
                  checked={postponeTime === '10'}
                  onChange={(e) => setPostponeTime(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">10 dakika</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postponeTime"
                  value="30"
                  checked={postponeTime === '30'}
                  onChange={(e) => setPostponeTime(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">30 dakika</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postponeTime"
                  value="60"
                  checked={postponeTime === '60'}
                  onChange={(e) => setPostponeTime(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">1 saat</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postponeTime"
                  value="custom"
                  checked={postponeTime === 'custom'}
                  onChange={(e) => setPostponeTime(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Özel süre</span>
              </label>
              
              {postponeTime === 'custom' && (
                <div className="ml-6 mt-2 space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Gün</label>
                      <input
                        type="number"
                        value={customDays}
                        onChange={(e) => setCustomDays(e.target.value)}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Saat</label>
                      <input
                        type="number"
                        value={customHours}
                        onChange={(e) => setCustomHours(e.target.value)}
                        placeholder="0"
                        min="0"
                        max="23"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    En az 1 saat girmeniz gerekiyor
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handlePostponeConfirm} className="flex-1">
                Ertele
              </Button>
              <Button 
                onClick={() => {
                  setShowPostponeModal(false)
                  setPostponeTime('10')
                  setCustomDays('')
                  setCustomHours('')
                }} 
                variant="outline"
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 