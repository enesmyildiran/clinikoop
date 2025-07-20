'use client'

import { useClinic } from '@/contexts/ClinicContext'

export default function ClinicInfoPage() {
  const { clinic, isLoading } = useClinic()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!clinic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Klinik Bulunamadı</h1>
          <p className="text-gray-600">Lütfen doğru subdomain kullandığınızdan emin olun.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div 
          className="px-6 py-8 text-center"
          style={{ backgroundColor: `${clinic.primaryColor}10` }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4"
            style={{ backgroundColor: clinic.primaryColor }}
          >
            {clinic.name.charAt(0)}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{clinic.name}</h1>
          <p className="text-lg text-gray-600">Subdomain: {clinic.subdomain}</p>
        </div>

        {/* Clinic Info */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Adres:</p>
                  <p className="font-medium">{clinic.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefon:</p>
                  <p className="font-medium">{clinic.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">E-posta:</p>
                  <p className="font-medium">{clinic.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tema Bilgileri</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Klinik ID:</p>
                  <p className="font-medium">{clinic.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subdomain:</p>
                  <p className="font-medium">{clinic.subdomain}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ana Renk:</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: clinic.primaryColor }}
                    ></div>
                    <span className="font-medium">{clinic.primaryColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Links */}
        <div className="px-6 py-6 bg-gray-100 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Linkleri</h3>
          <div className="flex flex-wrap gap-2">
            {['test1', 'test2', 'test3'].map((subdomain) => (
              <a
                key={subdomain}
                href={`http://${subdomain}.localhost:3000/site/clinic-info`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {subdomain}.localhost:3000
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 