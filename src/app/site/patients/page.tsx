"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FaPlus, FaUser, FaPhone, FaEnvelope, FaSearch, FaInstagram, FaFacebook, FaWhatsapp, FaBell, FaEye, FaEdit, FaGlobe } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { useQuery } from '@tanstack/react-query'
import { PageContainer } from '@/components/ui/PageContainer'

// Ülke bayrakları için emoji mapping
const countryFlags: { [key: string]: string } = {
  'TR': '🇹🇷',
  'US': '🇺🇸',
  'GB': '🇬🇧',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'IT': '🇮🇹',
  'ES': '🇪🇸',
  'NL': '🇳🇱',
  'BE': '🇧🇪',
  'CH': '🇨🇭',
  'AT': '🇦🇹',
  'SE': '🇸🇪',
  'NO': '🇳🇴',
  'DK': '🇩🇰',
  'FI': '🇫🇮',
  'PL': '🇵🇱',
  'CZ': '🇨🇿',
  'HU': '🇭🇺',
  'RO': '🇷🇴',
  'BG': '🇧🇬',
  'HR': '🇭🇷',
  'SI': '🇸🇮',
  'SK': '🇸🇰',
  'LT': '🇱🇹',
  'LV': '🇱🇻',
  'EE': '🇪🇪',
  'IE': '🇮🇪',
  'PT': '🇵🇹',
  'GR': '🇬🇷',
  'CY': '🇨🇾',
  'MT': '🇲🇹',
  'LU': '🇱🇺',
  'default': '🌍'
};

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

// Source kodundan Türkçe ismine mapping
const sourceNames: { [key: string]: string } = {
  'google': 'Google Arama',
  'instagram': 'Instagram',
  'facebook': 'Facebook',
  'whatsapp': 'WhatsApp',
  'referral': 'Hasta Referansı',
  'social_media': 'Sosyal Medya',
  'website': 'Web Sitesi',
  'advertisement': 'Reklam',
  'walk_in': 'Yoldan Geçen',
  'other': 'Diğer'
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  const { data: sources = [] } = useQuery({
    queryKey: ['referral-sources'],
    queryFn: () => fetch('/api/referral-sources').then(res => res.json())
  })

  // sources'ın array olduğundan emin ol
  const sourcesArray = Array.isArray(sources) ? sources : []

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setSearch(q)
    fetchPatients(q)
    // eslint-disable-next-line
  }, [searchParams])

  const fetchPatients = async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/patients')
      const data = await res.json()
      let filtered = data.patients
      if (q) {
        const qLower = q.toLowerCase()
        filtered = filtered.filter((p: any) =>
          (p.name || '').toLowerCase().includes(qLower) ||
          (p.phone || '').toLowerCase().includes(qLower) ||
          (p.email || '').toLowerCase().includes(qLower)
        )
      }
      setPatients(filtered)
    } catch {
      setPatients([])
    }
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(search ? { q: search } : {})
    router.replace(`/patients${params.toString() ? `?${params}` : ''}`)
  }

  const getCountryFlag = (countryCode: string) => {
    return countryFlags[countryCode?.toUpperCase()] || countryFlags.default;
  };

  const handleContactClick = (type: string, value: string) => {
    if (!value) return;
    
    switch (type) {
      case 'email':
        window.open(`mailto:${value}`, '_blank');
        break;
      case 'phone':
        window.open(`tel:${value}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${value.replace(/\D/g, '')}`, '_blank');
        break;
      case 'instagram':
        window.open(`https://instagram.com/${value.replace('@', '')}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://facebook.com/${value}`, '_blank');
        break;
    }
  };

  const handleCreateReminder = (patientId: string, patientName: string) => {
    router.push(`/site/reminders/new?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`);
  };

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Hasta Listesi</h1>
        <Link href="/site/patients/new">
          <Button className="flex items-center gap-2">
            <FaPlus /> Yeni Hasta
          </Button>
        </Link>
      </div>
      
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="İsim, telefon veya e-posta ile ara..."
          className="w-full md:w-96 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
        />
        <Button type="submit" className="flex items-center gap-2">
          <FaSearch /> Ara
        </Button>
      </form>
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="text-center text-gray-500 py-12">Yükleniyor...</div>
        ) : patients.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Kayıtlı hasta bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İkamet Ülkesi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kaynak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doğum Tarihi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teklif Sayısı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sigorta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">ID: {patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {patient.phone && (
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-gray-400 text-xs" />
                            <button
                              onClick={() => handleContactClick('phone', patient.phone)}
                              className="text-blue-600 hover:underline text-sm cursor-pointer"
                            >
                              {patient.phone}
                            </button>
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400 text-xs" />
                            <button
                              onClick={() => handleContactClick('email', patient.email)}
                              className="text-blue-600 hover:underline text-sm cursor-pointer"
                            >
                              {patient.email}
                            </button>
                          </div>
                        )}
                        {patient.instagram && (
                          <div className="flex items-center gap-2">
                            <FaInstagram className="text-gray-400 text-xs" />
                            <button
                              onClick={() => handleContactClick('instagram', patient.instagram)}
                              className="text-blue-600 hover:underline text-sm cursor-pointer"
                            >
                              {patient.instagram}
                            </button>
                          </div>
                        )}
                        {patient.facebook && (
                          <div className="flex items-center gap-2">
                            <FaFacebook className="text-gray-400 text-xs" />
                            <button
                              onClick={() => handleContactClick('facebook', patient.facebook)}
                              className="text-blue-600 hover:underline text-sm cursor-pointer"
                            >
                              {patient.facebook}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCountryFlag(patient.country)}</span>
                        <span className="text-sm text-gray-900">
                          {countryNames[patient.country?.toUpperCase()] || patient.country || 'Belirtilmemiş'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {patient.referralSource ? 
                          sourcesArray.find(s => s.id === patient.referralSource.id)?.name || 
                          sourceNames[patient.referralSource.name] || 
                          patient.referralSource.name : 
                          'Belirtilmemiş'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient._count?.offers || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        patient.hasInsurance ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.hasInsurance ? 'Var' : 'Yok'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/site/patients/${patient.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Görüntüle"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          href={`/site/patients/${patient.id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                          title="Düzenle"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleCreateReminder(patient.id, patient.name)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Hatırlatma Oluştur"
                        >
                          <FaBell />
                        </button>
                        {patient.phone && (
                          <a
                            href={`https://wa.me/${patient.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900"
                            title="WhatsApp"
                          >
                            <FaWhatsapp />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  )
} 