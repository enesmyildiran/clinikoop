'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useToast } from '@/components/ui/Toast'

interface Reminder {
  id: string
  title: string
  description?: string
  dueDate: string
  status: 'PENDING' | 'DONE' | 'POSTPONED' | 'CLOSED_WITH_REASON'
  reason?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  isPrivate: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
  patient?: {
    id: string
    name: string
    phone: string
  }
  user?: {
    id: string
    name: string
  }
  offer?: {
    id: string
    title: string
  }
}

interface ReminderContextType {
  reminders: Reminder[]
  activeReminders: Reminder[]
  todayReminders: Reminder[]
  pinnedReminders: Reminder[]
  loading: boolean
  refreshReminders: () => Promise<void>
  createReminder: (data: any) => Promise<boolean>
  updateReminder: (id: string, data: any) => Promise<boolean>
  deleteReminder: (id: string) => Promise<boolean>
  markAsDone: (id: string) => Promise<boolean>
  postponeReminder: (id: string, newDate: string) => Promise<boolean>
  closeWithReason: (id: string, reason: string) => Promise<boolean>
  togglePinned: (id: string) => Promise<boolean>
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined)

export function useReminders() {
  const context = useContext(ReminderContext)
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider')
  }
  return context
}

interface ReminderProviderProps {
  children: ReactNode
}

export function ReminderProvider({ children }: ReminderProviderProps) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  // Aktif hatırlatmalar (PENDING durumunda olanlar)
  const activeReminders = reminders.filter(r => r.status === 'PENDING')
  
  // Bugünkü hatırlatmalar
  const todayReminders = reminders.filter(r => {
    const today = new Date()
    const reminderDate = new Date(r.dueDate)
    return r.status === 'PENDING' && 
           reminderDate.toDateString() === today.toDateString()
  })

  // Sabitlenmiş hatırlatmalar
  const pinnedReminders = reminders.filter(r => r.isPinned && r.status === 'PENDING')

  // Hatırlatmaları yenile
  const refreshReminders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/reminders')
      const data = await response.json()
      
      if (data.success) {
        setReminders(data.reminders)
      } else {
        addToast({
          message: 'Hatırlatmalar yüklenirken hata oluştu',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Reminder refresh error:', error)
      addToast({
        message: 'Hatırlatmalar yüklenirken hata oluştu',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  // Yeni hatırlatma oluştur
  const createReminder = async (data: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (result.success) {
        await refreshReminders()
        addToast({
          message: 'Hatırlatma başarıyla oluşturuldu',
          type: 'success'
        })
        return true
      } else {
        addToast({
          message: result.error || 'Hatırlatma oluşturulamadı',
          type: 'error'
        })
        return false
      }
    } catch (error) {
      console.error('Create reminder error:', error)
      addToast({
        message: 'Hatırlatma oluşturulurken hata oluştu',
        type: 'error'
      })
      return false
    }
  }

  // Hatırlatma güncelle
  const updateReminder = async (id: string, data: any): Promise<boolean> => {
    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (result.success) {
        await refreshReminders()
        addToast({
          message: 'Hatırlatma başarıyla güncellendi',
          type: 'success'
        })
        return true
      } else {
        addToast({
          message: result.error || 'Hatırlatma güncellenemedi',
          type: 'error'
        })
        return false
      }
    } catch (error) {
      console.error('Update reminder error:', error)
      addToast({
        message: 'Hatırlatma güncellenirken hata oluştu',
        type: 'error'
      })
      return false
    }
  }

  // Hatırlatma sil
  const deleteReminder = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        await refreshReminders()
        addToast({
          message: 'Hatırlatma başarıyla silindi',
          type: 'success'
        })
        return true
      } else {
        addToast({
          message: result.error || 'Hatırlatma silinemedi',
          type: 'error'
        })
        return false
      }
    } catch (error) {
      console.error('Delete reminder error:', error)
      addToast({
        message: 'Hatırlatma silinirken hata oluştu',
        type: 'error'
      })
      return false
    }
  }

  // Tamamlandı olarak işaretle
  const markAsDone = async (id: string): Promise<boolean> => {
    return updateReminder(id, { status: 'DONE' })
  }

  // Ertele
  const postponeReminder = async (id: string, newDate: string): Promise<boolean> => {
    return updateReminder(id, { 
      status: 'POSTPONED',
      dueDate: newDate 
    })
  }

  // Sebep girerek kapat
  const closeWithReason = async (id: string, reason: string): Promise<boolean> => {
    return updateReminder(id, { 
      status: 'CLOSED_WITH_REASON',
      reason 
    })
  }

  // Sabitleme durumunu değiştir
  const togglePinned = async (id: string): Promise<boolean> => {
    const reminder = reminders.find(r => r.id === id)
    if (!reminder) return false
    
    return updateReminder(id, { 
      isPinned: !reminder.isPinned 
    })
  }

  // İlk yükleme
  useEffect(() => {
    refreshReminders()
  }, [])

  const value: ReminderContextType = {
    reminders,
    activeReminders,
    todayReminders,
    pinnedReminders,
    loading,
    refreshReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    markAsDone,
    postponeReminder,
    closeWithReason,
    togglePinned
  }

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  )
} 