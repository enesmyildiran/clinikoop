'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ReminderProvider } from '@/contexts/ReminderContext'
import { NotificationProvider } from '@/contexts/NotificationContext'

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
    <QueryClientProvider client={queryClient}>
      <ReminderProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ReminderProvider>
    </QueryClientProvider>
  )
} 