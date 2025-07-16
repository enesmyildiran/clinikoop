"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaSave, FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt, FaNotesMedical, FaGlobe, FaIdCard, FaShieldAlt, FaPlus, FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { useQuery } from '@tanstack/react-query'

// Ülke kodundan ülke ismine mapping
const countryNames: { [key: string]: string } = {
  'TR': 'Türkiye',
  'US': 'Amerika Birleşik Devletleri',
  'GB': 'Birleşik Krallık',
  'DE': 'Almanya',
  'FR': 'Fransa',
  'IT': 'İtalya',
  'ES': 'İspanya',
  'NL': 'Hollanda',
  'BE': 'Belçika',
  'CH': 'İsviçre',
  'AT': 'Avusturya',
  'SE': 'İsveç',
  'NO': 'Norveç',
  'DK': 'Danimarka',
  'FI': 'Finlandiya',
  'PL': 'Polonya',
  'CZ': 'Çekya',
  'HU': 'Macaristan',
  'RO': 'Romanya',
  'BG': 'Bulgaristan',
  'HR': 'Hırvatistan',
  'SI': 'Slovenya',
  'SK': 'Slovakya',
  'LT': 'Litvanya',
  'LV': 'Letonya',
  'EE': 'Estonya',
  'IE': 'İrlanda',
  'PT': 'Portekiz',
  'GR': 'Yunanistan',
  'CY': 'Kıbrıs',
  'MT': 'Malta',
  'LU': 'Lüksemburg'
};

export default function NewPatientPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  
  const [patient, setPatient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    phoneCountry: 'TR',
    email: '',
    birthDate: '',
    gender: '',
    nationality: 'TR',
    country: 'TR',
    address: '',
    city: '',
    emergencyContact: '',
    emergencyPhone: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    referralSourceId: '',
    medicalHistory: '',
    allergies: '',
    insurance: '',
    insuranceNumber: '',
    notes: '',
    isActive: true
  })

  const [errors, setErrors] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  // Kaynakları getir
  const { data: sources = [] } = useQuery({
    queryKey: ['referral-sources'],
    queryFn: () => fetch('/api/referral-sources').then(res => res.json())
  })

  // sources'ın array olduğundan emin ol
  const sourcesArray = Array.isArray(sources) ? sources : []

  const validateStep = (step: number) => {
    const newErrors: any = {}
    
    switch (step) {
      case 1: // Kişisel Bilgiler
        if (!patient.firstName.trim()) newErrors.firstName = 'Ad zorunludur'
        if (!patient.lastName.trim()) newErrors.lastName = 'Soyad zorunludur'
        if (!patient.phone.trim()) newErrors.phone = 'Telefon zorunludur'
        if (patient.email && !/\S+@\S+\.\S+/.test(patient.email)) {
          newErrors.email = 'Geçerli bir e-posta adresi giriniz'
        }
        break
      case 2: // Adres ve İletişim
        if (!patient.country) newErrors.country = 'İkamet ülkesi seçimi zorunludur'
        if (!patient.nationality) newErrors.nationality = 'Vatandaşlık seçimi zorunludur'
        break
      case 3: // Tıbbi Bilgiler
        // Bu adımda zorunlu alan yok, opsiyonel
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSave = async () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)

    const payload = {
      name: `${patient.firstName} ${patient.lastName}`.trim(),
      phone: patient.phone,
      phoneCountry: patient.phoneCountry,
      email: patient.email || undefined,
      birthDate: patient.birthDate || undefined,
      gender: patient.gender || undefined,
      nationality: patient.nationality,
      country: patient.country,
      address: patient.address || undefined,
      city: patient.city || undefined,
      emergencyContact: patient.emergencyContact || undefined,
      emergencyPhone: patient.emergencyPhone || undefined,
      instagram: patient.instagram || undefined,
      facebook: patient.facebook || undefined,
      whatsapp: patient.whatsapp || undefined,
      referralSourceId: patient.referralSourceId || undefined,
      medicalHistory: patient.medicalHistory || undefined,
      allergies: patient.allergies || undefined,
      insurance: patient.insurance || undefined,
      insuranceNumber: patient.insuranceNumber || undefined,
      notes: patient.notes || undefined,
    }

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        router.push('/patients')
      } else {
        const data = await res.json()
        alert(data.error || 'Kayıt başarısız!')
      }
    } catch (e) {
      alert('Sunucu hatası!')
    }
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setPatient((prev: any) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }))
    }
  }

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-2 text-sm text-gray-600">
        {currentStep === 1 && 'Kişisel Bilgiler'}
        {currentStep === 2 && 'Adres ve İletişim'}
        {currentStep === 3 && 'Tıbbi Bilgiler'}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FaUser className="text-blue-600" />
          Kişisel Bilgiler
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad *
            </label>
            <Input
              value={patient.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Hastanın adı"
              error={errors.firstName}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soyad *
            </label>
            <Input
              value={patient.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Hastanın soyadı"
              error={errors.lastName}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon *
            </label>
            <PhoneInput
              value={patient.phone}
              onChange={(value) => handleInputChange('phone', value)}
              country={patient.phoneCountry}
              onCountryChange={(country) => handleInputChange('phoneCountry', country)}
              placeholder="532 123 4567"
              error={errors.phone}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <Input
              type="email"
              value={patient.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="hasta@email.com"
              error={errors.email}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doğum Tarihi
            </label>
            <Input
              type="date"
              value={patient.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cinsiyet
            </label>
            <Select 
              value={patient.gender} 
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Erkek</SelectItem>
                <SelectItem value="female">Kadın</SelectItem>
                <SelectItem value="other">Diğer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FaGlobe className="text-blue-600" />
          Adres ve İletişim Bilgileri
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vatandaşlık *
            </label>
            <Select
              value={patient.nationality}
              onValueChange={(value) => handleInputChange('nationality', value)}
            >
              <SelectTrigger className={errors.nationality ? 'border-red-500' : ''}>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countryNames).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.nationality && (
              <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İkamet Ülkesi *
            </label>
            <Select
              value={patient.country}
              onValueChange={(value) => handleInputChange('country', value)}
            >
              <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countryNames).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kaynak/Referans
            </label>
            <select
              value={patient.referralSourceId}
              onChange={(e) => handleInputChange('referralSourceId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Hastanın kaynağını seçin</option>
              {sourcesArray
                .filter((source: any) => source.isActive)
                .sort((a: any, b: any) => a.order - b.order)
                .map((source: any) => (
                  <option key={source.id} value={source.id}>
                    {source.displayName}
                  </option>
                ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adres
            </label>
            <Textarea
              value={patient.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Tam adres bilgisi"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şehir
              </label>
              <Input
                value={patient.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="İstanbul"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center gap-2">
            <FaPhone className="text-green-600" />
            Acil Durum İletişimi
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Acil Durum Kişisi
              </label>
              <Input
                value={patient.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Acil durumda aranacak kişi"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Acil Durum Telefonu
              </label>
              <Input
                value={patient.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                placeholder="+90 532 123 4567"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center gap-2">
            <FaEnvelope className="text-blue-600" />
            Sosyal Medya ve İletişim
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <Input
                value={patient.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="@kullaniciadi"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <Input
                value={patient.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                placeholder="Facebook kullanıcı adı"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <Input
                value={patient.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                placeholder="WhatsApp numarası"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FaNotesMedical className="text-blue-600" />
          Tıbbi Bilgiler
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tıbbi Geçmiş
            </label>
            <Textarea
              value={patient.medicalHistory}
              onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
              placeholder="Önceki hastalıklar, ameliyatlar, kronik rahatsızlıklar..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alerjiler
            </label>
            <Textarea
              value={patient.allergies}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              placeholder="İlaç, gıda, lateks alerjileri..."
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sigorta Şirketi
              </label>
              <Input
                value={patient.insurance}
                onChange={(e) => handleInputChange('insurance', e.target.value)}
                placeholder="Sigorta şirketi adı"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sigorta Numarası
              </label>
              <Input
                value={patient.insuranceNumber}
                onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                placeholder="Sigorta numarası"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notlar
            </label>
            <Textarea
              value={patient.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ek notlar, özel durumlar..."
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <FaArrowLeft /> Geri
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Yeni Hasta Kaydı</h1>
            <p className="text-gray-600 mt-1">Hasta bilgilerini adım adım girin</p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Form Content */}
      <div className="mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 1}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FaChevronLeft /> Önceki
        </Button>
        
        <div className="flex items-center gap-3">
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Sonraki <FaChevronRight />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <FaSave /> {isLoading ? 'Kaydediliyor...' : 'Hastayı Kaydet'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 