import { getClinicBySubdomain, getAllClinics } from '@/lib/clinics'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function TestPage({ searchParams }: PageProps) {
  const clinicSubdomain = Array.isArray(searchParams.clinic) 
    ? searchParams.clinic[0] 
    : searchParams.clinic || 'default'
  
  const clinic = getClinicBySubdomain(clinicSubdomain)
  const allClinics = getAllClinics()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Subdomain Test Sayfası
        </h1>
        
        {/* Current Clinic Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Mevcut Klinik Bilgileri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Subdomain:</p>
              <p className="font-medium">{clinic.subdomain}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Klinik Adı:</p>
              <p className="font-medium">{clinic.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Açıklama:</p>
              <p className="font-medium">{clinic.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tema Rengi:</p>
              <div className="flex items-center">
                <div 
                  className="w-6 h-6 rounded mr-2"
                  style={{ backgroundColor: clinic.primaryColor }}
                ></div>
                <span className="font-medium">{clinic.primaryColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* All Clinics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tüm Klinikler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allClinics.map((clinic) => (
              <div 
                key={clinic.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{ borderColor: clinic.primaryColor }}
              >
                <div className="flex items-center mb-2">
                  <div 
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: clinic.primaryColor }}
                  ></div>
                  <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{clinic.subdomain}</p>
                <p className="text-xs text-gray-500">{clinic.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Test Links */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Linkleri
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Bu linkleri test etmek için /etc/hosts dosyanızı düzenleyin:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <code className="text-sm">
                127.0.0.1 test1.localhost<br/>
                127.0.0.1 test2.localhost<br/>
                127.0.0.1 test3.localhost
              </code>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {['test1', 'test2', 'test3'].map((subdomain) => (
                <a
                  key={subdomain}
                  href={`http://${subdomain}.localhost:3000`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {subdomain}.localhost:3000
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 