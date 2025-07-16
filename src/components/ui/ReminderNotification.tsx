'use client'

import { useState, useEffect } from 'react'
import { FaBell, FaCheck, FaTimes, FaClock, FaUser, FaFileAlt } from 'react-icons/fa'
import { Button } from './Button'
import { useReminders } from '@/contexts/ReminderContext'
import { useToast } from '@/components/ui/Toast'

interface ReminderNotificationProps {
  reminder: {
    id: string
    title: string
    description?: string
    dueDate: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
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
  onClose: () => void
}

export default function ReminderNotification({ reminder, onClose }: ReminderNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const { markAsDone, postponeReminder } = useReminders()
  const { addToast } = useToast()

  useEffect(() => {
    // Animasyon için kısa gecikme
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date()
      const dueDate = new Date(reminder.dueDate)
      const diff = dueDate.getTime() - now.getTime()
      
      if (diff <= 0) {
        setTimeLeft('Şimdi!')
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        
        if (hours > 0) {
          setTimeLeft(`${hours}s ${minutes}dk`)
        } else {
          setTimeLeft(`${minutes}dk`)
        }
      }
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 60000) // Her dakika güncelle

    return () => clearInterval(interval)
  }, [reminder.dueDate])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'border-l-green-500'
      case 'MEDIUM': return 'border-l-blue-500'
      case 'HIGH': return 'border-l-orange-500'
      case 'URGENT': return 'border-l-red-500'
      default: return 'border-l-gray-500'
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
    addToast({
      message: 'Hatırlatma tamamlandı',
      type: 'success'
    })
    onClose()
  }

  const handlePostpone = async () => {
    // 1 saat ertele
    const newDate = new Date()
    newDate.setHours(newDate.getHours() + 1)
    await postponeReminder(reminder.id, newDate.toISOString())
    addToast({
      message: 'Hatırlatma 1 saat ertelendi',
      type: 'success'
    })
    onClose()
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Animasyon bitince kapat
  }

  const isOverdue = new Date(reminder.dueDate) < new Date()

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l-4 ${getPriorityColor(reminder.priority)} transform transition-transform duration-300 ease-in-out z-50 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBell className={`w-5 h-5 ${isOverdue ? 'text-red-500' : 'text-blue-500'}`} />
              <h3 className="font-semibold text-gray-900">Hatırlatma</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <FaTimes className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Priority Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                reminder.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                reminder.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                reminder.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {getPriorityText(reminder.priority)} Öncelik
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <FaClock className="w-3 h-3" />
                <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                  {timeLeft}
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <h4 className="font-medium text-gray-900 text-lg mb-2">{reminder.title}</h4>
              {reminder.description && (
                <p className="text-sm text-gray-600">{reminder.description}</p>
              )}
            </div>

            {/* Related Info */}
            <div className="space-y-3">
              {reminder.patient && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUser className="w-3 h-3" />
                  <span>Hasta: {reminder.patient.name}</span>
                </div>
              )}
              {reminder.offer && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaFileAlt className="w-3 h-3" />
                  <span>Teklif: {reminder.offer.title}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock className="w-3 h-3" />
                <span>
                  {new Date(reminder.dueDate).toLocaleString('tr-TR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {isOverdue && ' (Gecikmiş)'}
                </span>
              </div>
            </div>

            {/* Warning Message */}
            {isOverdue && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ Bu hatırlatma gecikmiş! Lütfen hemen işlem yapın.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
          <Button
            onClick={handleMarkAsDone}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <FaCheck className="w-4 h-4 mr-2" />
            Tamamlandı
          </Button>
          <Button
            onClick={handlePostpone}
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <FaClock className="w-4 h-4 mr-2" />
            1 Saat Ertele
          </Button>
        </div>
      </div>
    </div>
  )
} 