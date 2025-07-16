'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useReminders } from './ReminderContext'
import ReminderNotification from '@/components/ui/ReminderNotification'

interface NotificationContextType {
  showNotification: (reminder: any) => void
  hideNotification: () => void
  isNotificationVisible: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [currentNotification, setCurrentNotification] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { todayReminders } = useReminders()

  // Önemli hatırlatmaları kontrol et (HIGH ve URGENT öncelikli)
  useEffect(() => {
    const checkImportantReminders = () => {
      const now = new Date()
      const importantReminders = todayReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate)
        const timeDiff = dueDate.getTime() - now.getTime()
        
        // Dakika geldiğinde veya gecikmiş olan önemli hatırlatmalar
        return (reminder.priority === 'HIGH' || reminder.priority === 'URGENT') &&
               (timeDiff <= 0 || timeDiff <= 5 * 60 * 1000) // 5 dakika içinde veya gecikmiş
      })

      if (importantReminders.length > 0 && !isVisible) {
        // En önemli olanı göster (URGENT > HIGH, sonra en yakın tarih)
        const mostImportant = importantReminders.sort((a, b) => {
          if (a.priority === 'URGENT' && b.priority !== 'URGENT') return -1
          if (b.priority === 'URGENT' && a.priority !== 'URGENT') return 1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })[0]

        showNotification(mostImportant)
      }
    }

    // Her dakika kontrol et
    const interval = setInterval(checkImportantReminders, 60000)
    checkImportantReminders() // İlk kontrol

    return () => clearInterval(interval)
  }, [todayReminders, isVisible])

  const showNotification = (reminder: any) => {
    setCurrentNotification(reminder)
    setIsVisible(true)
  }

  const hideNotification = () => {
    setIsVisible(false)
    setTimeout(() => {
      setCurrentNotification(null)
    }, 300) // Animasyon bitince temizle
  }

  return (
    <NotificationContext.Provider value={{
      showNotification,
      hideNotification,
      isNotificationVisible: isVisible
    }}>
      {children}
      
      {/* Bildirim Bileşeni */}
      {currentNotification && isVisible && (
        <ReminderNotification
          reminder={currentNotification}
          onClose={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  )
} 