import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
  clinicId?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  permissions?: string
}

interface Clinic {
  id: string
  name: string
  subdomain: string
  domain?: string
  isActive: boolean
  maxUsers?: number
  maxPatients?: number
  maxOffers?: number
}

interface AuthData {
  user: User | null
  clinic: Clinic | null
  clinics: Clinic[]
  isSuperAdmin: boolean
  isDevelopment: boolean
  isLoading: boolean
  error: string | null
}

export function useAuth() {
  const [authData, setAuthData] = useState<AuthData>({
    user: null,
    clinic: null,
    clinics: [],
    isSuperAdmin: false,
    isDevelopment: false,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    fetchAuthData()
  }, [])

  const fetchAuthData = async () => {
    try {
      setAuthData(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        throw new Error('Kullanıcı bilgileri alınamadı')
      }
      
      const data = await response.json()
      // Eğer kullanıcıya birden fazla klinik atanmışsa (ör: ClinicUser -> clinics ilişkisi)
      let clinics: Clinic[] = []
      if (data.user && data.user.clinics) {
        clinics = data.user.clinics
      } else if (data.clinic) {
        clinics = [data.clinic]
      }
      setAuthData({
        user: data.user,
        clinic: data.clinic,
        clinics,
        isSuperAdmin: data.isSuperAdmin,
        isDevelopment: data.isDevelopment || false,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      setAuthData({
        user: null,
        clinic: null,
        clinics: [],
        isSuperAdmin: false,
        isDevelopment: false,
        isLoading: false,
        error: error.message
      })
    }
  }

  const refetch = () => {
    fetchAuthData()
  }

  return {
    ...authData,
    refetch
  }
} 