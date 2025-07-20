'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaCheck, FaCalendar, FaTimes, FaEdit, FaTrash, FaBell, FaUser, FaFileAlt, FaThumbtack } from 'react-icons/fa'
import { Button } from './Button'
import { useReminders } from '@/contexts/ReminderContext'
import { useToast } from '@/components/ui/Toast'

interface ReminderCardProps {
  reminder: {
    id: string
    title: string
    description?: string
    dueDate: string
    isCompleted: boolean
    isPinned: boolean
    patient?: {
      id: string
      name: string
      phone: string
    }
    offer?: {
      id: string
      title: string
    }
  }
  showActions?: boolean
  className?: string
}

export default function ReminderCard({ reminder, showActions = true, className = '' }: ReminderCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { updateReminder, deleteReminder } = useReminders()
  const { addToast } = useToast()

  const isOverdue = new Date(reminder.dueDate) < new Date() && !reminder.isCompleted

  const handleToggleComplete = async () => {
    setIsProcessing(true)
    try {
      const success = await updateReminder(reminder.id, {
        isCompleted: !reminder.isCompleted
      })
      
      if (success) {
        addToast({
          message: reminder.isCompleted ? 'Hatırlatma aktif edildi' : 'Hatırlatma tamamlandı',
          type: 'success'
        })
      }
    } catch (error) {
      addToast({
        message: 'İşlem sırasında hata oluştu',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTogglePinned = async () => {
    setIsProcessing(true)
    try {
      const success = await updateReminder(reminder.id, {
        isPinned: !reminder.isPinned
      })
      
      if (success) {
        addToast({
          message: reminder.isPinned ? 'Hatırlatma sabitlemesi kaldırıldı' : 'Hatırlatma sabitlendi',
          type: 'success'
        })
      }
    } catch (error) {
      addToast({
        message: 'İşlem sırasında hata oluştu',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu hatırlatmayı silmek istediğinizden emin misiniz?')) {
      return
    }

    setIsProcessing(true)
    try {
      const success = await deleteReminder(reminder.id)
      
      if (success) {
        addToast({
          message: 'Hatırlatma başarıyla silindi',
          type: 'success'
        })
      }
    } catch (error) {
      addToast({
        message: 'Silme sırasında hata oluştu',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className} ${
      reminder.isCompleted ? 'opacity-60' : ''
    } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          {reminder.isPinned && (
            <FaThumbtack className="text-blue-500 text-sm" />
          )}
          <h3 className={`font-semibold text-gray-800 ${
            reminder.isCompleted ? 'line-through' : ''
          }`}>
            {reminder.title}
          </h3>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1">
            <Button
              onClick={handleTogglePinned}
              variant="ghost"
              size="sm"
              disabled={isProcessing}
              className={`p-1 ${reminder.isPinned ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <FaThumbtack className="w-3 h-3" />
            </Button>
            
            <Button
              onClick={handleToggleComplete}
              variant="ghost"
              size="sm"
              disabled={isProcessing}
              className={`p-1 ${reminder.isCompleted ? 'text-green-600' : 'text-gray-400'}`}
            >
              <FaCheck className="w-3 h-3" />
            </Button>
            
            <Link href={`/site/reminders/${reminder.id}/edit`}>
              <Button variant="ghost" size="sm" className="p-1 text-gray-400">
                <FaEdit className="w-3 h-3" />
              </Button>
            </Link>
            
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              disabled={isProcessing}
              className="p-1 text-red-400 hover:text-red-600"
            >
              <FaTrash className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Description */}
      {reminder.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {reminder.description}
        </p>
      )}

      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
        <FaCalendar className="w-3 h-3" />
        <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
          {formatDate(reminder.dueDate)}
        </span>
        {isOverdue && (
          <span className="text-red-600 text-xs font-medium">(Gecikmiş)</span>
        )}
      </div>

      {/* Related Items */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {reminder.patient && (
          <Link href={`/site/patients/${reminder.patient.id}`} className="flex items-center gap-1 hover:text-blue-600">
            <FaUser className="w-3 h-3" />
            <span>{reminder.patient.name}</span>
          </Link>
        )}
        
        {reminder.offer && (
          <Link href={`/site/offers/${reminder.offer.id}/edit`} className="flex items-center gap-1 hover:text-blue-600">
            <FaFileAlt className="w-3 h-3" />
            <span>{reminder.offer.title}</span>
          </Link>
        )}
      </div>

      {/* Status Badge */}
      <div className="mt-3">
        {reminder.isCompleted ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheck className="w-3 h-3 mr-1" />
            Tamamlandı
          </span>
        ) : isOverdue ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimes className="w-3 h-3 mr-1" />
            Gecikmiş
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaBell className="w-3 h-3 mr-1" />
            Bekliyor
          </span>
        )}
      </div>
    </div>
  )
} 