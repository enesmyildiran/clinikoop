'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface Clinic {
  id: string
  name: string
  subdomain: string
  primaryColor: string
  address?: string
  phone?: string
  email?: string
}

interface ClinicContextType {
  clinic: Clinic | null
  isLoading: boolean
}

const ClinicContext = createContext<ClinicContextType>({
  clinic: null,
  isLoading: true
})

// Örnek klinik verileri
const clinics: Record<string, Clinic> = {
  test1: {
    id: 'clinic-1',
    name: 'Test Klinik 1',
    subdomain: 'test1',
    primaryColor: '#3B82F6',
    address: 'Test Mahallesi, Test Sokak No:1, İstanbul',
    phone: '+90 212 555 0001',
    email: 'info@test1.com'
  },
  test2: {
    id: 'clinic-2',
    name: 'Test Klinik 2',
    subdomain: 'test2',
    primaryColor: '#10B981',
    address: 'Test Mahallesi, Test Sokak No:2, Ankara',
    phone: '+90 312 555 0002',
    email: 'info@test2.com'
  },
  test3: {
    id: 'clinic-3',
    name: 'Test Klinik 3',
    subdomain: 'test3',
    primaryColor: '#8B5CF6',
    address: 'Test Mahallesi, Test Sokak No:3, İzmir',
    phone: '+90 232 555 0003',
    email: 'info@test3.com'
  },
  default: {
    id: 'cmddb8kzd0000uz7a1dkruh4v',
    name: 'Test Klinik',
    subdomain: 'test-klinik',
    primaryColor: '#6B7280',
    address: 'Bilinmeyen Adres',
    phone: '+90 000 000 0000',
    email: 'info@testklinik.com'
  }
}

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const [clinic, setClinic] = useState<Clinic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const clinicSubdomain = searchParams.get('clinic') || 'default'
    const selectedClinic = clinics[clinicSubdomain] || clinics.default
    
    setClinic(selectedClinic)
    setIsLoading(false)
    
    console.log('🔍 Clinic Context - Seçilen klinik:', selectedClinic)
  }, [searchParams])

  return (
    <ClinicContext.Provider value={{ clinic, isLoading }}>
      {children}
    </ClinicContext.Provider>
  )
}

export function useClinic() {
  const context = useContext(ClinicContext)
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider')
  }
  return context
} 