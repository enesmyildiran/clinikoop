'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ReminderProvider } from '@/contexts/ReminderContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ToastProvider } from '@/components/ui/Toast'
import { AuthProvider } from '@/contexts/AuthContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <ReminderProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </ReminderProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
} 