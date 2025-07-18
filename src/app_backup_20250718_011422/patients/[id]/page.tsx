"use client"

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaPhone, FaEnvelope, FaBirthdayCake, FaInstagram, FaFacebook, FaWhatsapp, FaArrowLeft, FaFilePdf, FaLink, FaTrash, FaEdit, FaEye, FaBell, FaGlobe } from 'react-icons/fa';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { useQuery } from '@tanstack/react-query';

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

// null değerleri kaldıran yardımcı fonksiyon
function removeNulls(obj: Record<string, any>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;
  const [patient, setPatient] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    phoneCountry: 'TR',
    birthDate: '',
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
    nationality: 'TR',
    country: 'TR',
    isActive: true
  });
  const [statuses, setStatuses] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Confirm dialog states
  const [showDeletePatientDialog, setShowDeletePatientDialog] = useState(false);
  const [showDeleteOfferDialog, setShowDeleteOfferDialog] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  // Kaynakları getir
  const { data: sources = [] } = useQuery({
    queryKey: ['referral-sources'],
    queryFn: () => fetch('/api/referral-sources').then(res => res.json())
  });

  // sources'ın array olduğundan emin ol
  const sourcesArray = Array.isArray(sources) ? sources : [];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [pRes, oRes, sRes] = await Promise.all([
        fetch(`/api/patients?id=${patientId}`),
        fetch(`/api/offers?patientId=${patientId}`),
        fetch('/api/offer-statuses')
      ]);
      
      const pData = await pRes.json();
      const oData = await oRes.json();
      const sData = await sRes.json();
      
      setPatient(pData.patient || null);
      setEditForm(pData.patient || {});
      setOffers(oData.offers || []);
      setStatuses(sData.statuses || []);
      setLoading(false);
    };
    fetchData();
  }, [patientId]);

  const handleDeletePatient = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/patients?id=${patientId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/patients');
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteOffer = async () => {
    if (!offerToDelete) return;
    try {
      const offer = offers.find(o => o.id === offerToDelete);
      if (!offer) return;
      
      const res = await fetch(`/api/offers/${offer.slug}`, { method: 'DELETE' });
      if (res.ok) {
        setOffers(offers.filter(o => o.id !== offerToDelete));
      }
    } catch {}
    setOfferToDelete(null);
  };

  const handleSavePatient = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    console.log('handleSavePatient çağrıldı');
    // null değerleri kaldır
    const cleanData = removeNulls(editForm);
    console.log('Gönderilecek veri:', cleanData);
    try {
      const res = await fetch(`/api/patients?id=${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      });
      console.log('API Response status:', res.status);
      const responseData = await res.json();
      console.log('API Response data:', responseData);
      if (res.ok) {
        setPatient(responseData.patient);
        setIsEditing(false);
        console.log('Hasta başarıyla güncellendi');
      } else {
        console.error('API hatası:', responseData);
      }
    } catch (error) {
      console.error('Hasta güncellenirken hata:', error);
    }
  };

  const openDeleteOfferDialog = (offerId: string) => {
    setOfferToDelete(offerId);
    setShowDeleteOfferDialog(true);
  };

  const getCountryFlag = (countryCode: string) => {
    return countryFlags[countryCode?.toUpperCase()] || countryFlags.default;
  };

  // Teklif istatistikleri hesapla
  const getOfferStats = () => {
    const stats = {
      total: offers.length,
      byStatus: {} as Record<string, number>,
      byCurrency: {} as Record<string, number>, // Para birimlerine göre toplam
      totalValue: 0,
      averageValue: 0
    };

    offers.forEach(offer => {
      const statusName = offer.status?.displayName || offer.status?.name || 'Bilinmeyen';
      const currency = offer.currency || 'TRY';
      
      stats.byStatus[statusName] = (stats.byStatus[statusName] || 0) + 1;
      stats.byCurrency[currency] = (stats.byCurrency[currency] || 0) + (offer.totalPrice || 0);
      stats.totalValue += offer.totalPrice || 0;
    });

    stats.averageValue = stats.total > 0 ? stats.totalValue / stats.total : 0;
    return stats;
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

  if (loading) return <div className="text-center py-12">Yükleniyor...</div>;
  if (!patient) return <div className="text-center py-12 text-red-500">Hasta bulunamadı.</div>;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="text-blue-600 hover:underline flex items-center gap-2">
          <FaArrowLeft /> Geri
        </button>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FaEdit /> {isEditing ? 'İptal' : 'Düzenle'}
          </Button>
          <Button
            onClick={() => setShowDeletePatientDialog(true)} 
            disabled={deleting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <FaTrash /> Hastayı Sil
          </Button>
        </div>
      </div>

      {/* Hasta Bilgileri */}
      <div className="relative bg-white rounded-xl shadow p-6 mb-8 w-full max-w-6xl mx-auto"
        style={{
          maxHeight: expanded ? 'none' : '40vh',
          overflow: expanded ? 'visible' : 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)'
        }}
        ref={cardRef}
      >
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-600">
            <FaUser />
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <form className="space-y-4" onSubmit={handleSavePatient}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İkamet Ülkesi</label>
                    <select
                      value={editForm.country || 'TR'}
                      onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="TR">🇹🇷 Türkiye</option>
                      <option value="US">🇺🇸 Amerika Birleşik Devletleri</option>
                      <option value="GB">🇬🇧 Birleşik Krallık</option>
                      <option value="DE">🇩🇪 Almanya</option>
                      <option value="FR">🇫🇷 Fransa</option>
                      <option value="IT">🇮🇹 İtalya</option>
                      <option value="ES">🇪🇸 İspanya</option>
                      <option value="NL">🇳🇱 Hollanda</option>
                      <option value="BE">🇧🇪 Belçika</option>
                      <option value="CH">🇨🇭 İsviçre</option>
                      <option value="AT">🇦🇹 Avusturya</option>
                      <option value="SE">🇸🇪 İsveç</option>
                      <option value="NO">🇳🇴 Norveç</option>
                      <option value="DK">🇩🇰 Danimarka</option>
                      <option value="FI">🇫🇮 Finlandiya</option>
                      <option value="PL">🇵🇱 Polonya</option>
                      <option value="CZ">🇨🇿 Çekya</option>
                      <option value="HU">🇭🇺 Macaristan</option>
                      <option value="RO">🇷🇴 Romanya</option>
                      <option value="BG">🇧🇬 Bulgaristan</option>
                      <option value="HR">🇭🇷 Hırvatistan</option>
                      <option value="SI">🇸🇮 Slovenya</option>
                      <option value="SK">🇸🇰 Slovakya</option>
                      <option value="LT">🇱🇹 Litvanya</option>
                      <option value="LV">🇱🇻 Letonya</option>
                      <option value="EE">🇪🇪 Estonya</option>
                      <option value="IE">🇮🇪 İrlanda</option>
                      <option value="PT">🇵🇹 Portekiz</option>
                      <option value="GR">🇬🇷 Yunanistan</option>
                      <option value="CY">🇨🇾 Kıbrıs</option>
                      <option value="MT">🇲🇹 Malta</option>
                      <option value="LU">🇱🇺 Lüksemburg</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vatandaşlık</label>
                    <select
                      value={editForm.nationality || 'TR'}
                      onChange={(e) => setEditForm({...editForm, nationality: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="TR">🇹🇷 Türkiye</option>
                      <option value="DE">🇩🇪 Almanya</option>
                      <option value="GB">🇬🇧 Birleşik Krallık</option>
                      <option value="US">🇺🇸 Amerika Birleşik Devletleri</option>
                      <option value="FR">🇫🇷 Fransa</option>
                      <option value="IT">🇮🇹 İtalya</option>
                      <option value="ES">🇪🇸 İspanya</option>
                      <option value="NL">🇳🇱 Hollanda</option>
                      <option value="BE">🇧🇪 Belçika</option>
                      <option value="CH">🇨🇭 İsviçre</option>
                      <option value="AT">🇦🇹 Avusturya</option>
                      <option value="SE">🇸🇪 İsveç</option>
                      <option value="NO">🇳🇴 Norveç</option>
                      <option value="DK">🇩🇰 Danimarka</option>
                      <option value="FI">🇫🇮 Finlandiya</option>
                      <option value="PL">🇵🇱 Polonya</option>
                      <option value="CZ">🇨🇿 Çekya</option>
                      <option value="HU">🇭🇺 Macaristan</option>
                      <option value="RO">🇷🇴 Romanya</option>
                      <option value="BG">🇧🇬 Bulgaristan</option>
                      <option value="HR">🇭🇷 Hırvatistan</option>
                      <option value="SI">🇸🇮 Slovenya</option>
                      <option value="SK">🇸🇰 Slovakya</option>
                      <option value="LT">🇱🇹 Litvanya</option>
                      <option value="LV">🇱🇻 Letonya</option>
                      <option value="EE">🇪🇪 Estonya</option>
                      <option value="IE">🇮🇪 İrlanda</option>
                      <option value="PT">🇵🇹 Portekiz</option>
                      <option value="GR">🇬🇷 Yunanistan</option>
                      <option value="CY">🇨🇾 Kıbrıs</option>
                      <option value="MT">🇲🇹 Malta</option>
                      <option value="LU">🇱🇺 Lüksemburg</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                    <input
                      type="text"
                      value={editForm.city || ''}
                      onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kaynak/Referans</label>
                    <select
                      value={editForm.referralSourceId || ''}
                      onChange={(e) => setEditForm({...editForm, referralSourceId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seçiniz</option>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <PhoneInput
                      value={editForm.phone || ''}
                      onChange={(value) => setEditForm({...editForm, phone: value})}
                      country={editForm.phoneCountry || 'TR'}
                      onCountryChange={(country) => setEditForm({...editForm, phoneCountry: country})}
                      placeholder="532 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <input
                      type="text"
                      value={editForm.instagram || ''}
                      onChange={(e) => setEditForm({...editForm, instagram: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="@kullaniciadi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                    <input
                      type="text"
                      value={editForm.facebook || ''}
                      onChange={(e) => setEditForm({...editForm, facebook: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input
                      type="tel"
                      value={editForm.whatsapp || ''}
                      onChange={(e) => setEditForm({...editForm, whatsapp: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Acil İletişim</label>
                    <input
                      type="text"
                      value={editForm.emergencyContact || ''}
                      onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Acil Telefon</label>
                    <input
                      type="text"
                      value={editForm.emergencyPhone || ''}
                      onChange={(e) => setEditForm({...editForm, emergencyPhone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                    <textarea
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Sigortası</label>
                    <input
                      type="text"
                      value={editForm.insurance || ''}
                      onChange={(e) => setEditForm({...editForm, insurance: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sigorta Numarası</label>
                    <input
                      type="text"
                      value={editForm.insuranceNumber || ''}
                      onChange={(e) => setEditForm({...editForm, insuranceNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                    <input
                      type="date"
                      value={editForm.birthDate ? editForm.birthDate.substring(0,10) : ''}
                      onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tıbbi Geçmiş</label>
                    <textarea
                      value={editForm.medicalHistory || ''}
                      onChange={(e) => setEditForm({...editForm, medicalHistory: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alerjiler</label>
                    <textarea
                      value={editForm.allergies || ''}
                      onChange={(e) => setEditForm({...editForm, allergies: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    Aktif Hasta
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Not</label>
                  <textarea
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Kaydet
                  </Button>
                  <Button type="button" onClick={() => setIsEditing(false)} variant="outline">
                    İptal
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">{patient.name || '—'}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" title={`Vatandaşlık: ${countryNames[patient.nationality] || patient.nationality}`}>{getCountryFlag(patient.nationality)}</span>
                    {patient.country && patient.country !== patient.nationality && (
                      <span className="text-2xl" title={`İkamet: ${countryNames[patient.country] || patient.country}`}>{getCountryFlag(patient.country)}</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaGlobe className="text-gray-400" />
                      <span className="text-gray-600"><span className="font-medium">Vatandaşlık:</span> {countryNames[patient.nationality] || patient.nationality || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGlobe className="text-gray-400" />
                      <span className="text-gray-600"><span className="font-medium">İkamet:</span> {countryNames[patient.country] || patient.country || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      {patient.phone ? (
                        <button onClick={() => handleContactClick('phone', patient.phone)} className="text-blue-600 hover:underline cursor-pointer">{patient.phone}</button>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      {patient.email ? (
                        <button onClick={() => handleContactClick('email', patient.email)} className="text-blue-600 hover:underline cursor-pointer">{patient.email}</button>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBirthdayCake className="text-gray-400" />
                      <span>{patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('tr-TR') : '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGlobe className="inline mr-2 text-gray-400" />
                      <span>{patient.address || '—'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaInstagram className="text-pink-500" />
                      {patient.instagram ? (
                        <button onClick={() => handleContactClick('instagram', patient.instagram)} className="text-pink-500 hover:underline cursor-pointer">{patient.instagram}</button>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFacebook className="text-blue-700" />
                      {patient.facebook ? (
                        <button onClick={() => handleContactClick('facebook', patient.facebook)} className="text-blue-700 hover:underline cursor-pointer">{patient.facebook}</button>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaWhatsapp className="text-green-600" />
                      {patient.whatsapp ? (
                        <button onClick={() => handleContactClick('whatsapp', patient.whatsapp)} className="text-green-600 hover:underline cursor-pointer">{patient.whatsapp}</button>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGlobe className="text-gray-400" />
                      <span className="text-gray-600"><span className="font-medium">Acil İletişim:</span> {patient.emergencyContact || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <span className="text-gray-600"><span className="font-medium">Acil Telefon:</span> {patient.emergencyPhone || '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="text-gray-700 text-sm mb-2"><span className="font-semibold">Tıbbi Geçmiş:</span> {patient.medicalHistory || '—'}</div>
                  <div className="text-gray-700 text-sm mb-2"><span className="font-semibold">Alerjiler:</span> {patient.allergies || '—'}</div>
                  <div className="text-gray-700 text-sm mb-2"><span className="font-semibold">Sigorta:</span> {patient.insurance || '—'}</div>
                  <div className="text-gray-700 text-sm mb-2"><span className="font-semibold">Sigorta No:</span> {patient.insuranceNumber || '—'}</div>
                  <div className="text-gray-600 text-sm"><span className="font-semibold">Not:</span> {patient.notes || '—'}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="text-gray-700 text-sm mb-2"><span className="font-semibold">Kaynak:</span> {sourcesArray.find((s: any) => s.id === patient.referralSourceId)?.displayName || '—'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        {!expanded && (
          <>
            <div className="absolute left-0 bottom-0 w-full h-20 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 55%, rgba(255,255,255,1) 100%)',
                borderBottomLeftRadius: '0.75rem',
                borderBottomRightRadius: '0.75rem',
              }}
            />
            <button
              className="absolute left-1/2 -translate-x-1/2 bottom-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow border border-gray-200 text-blue-700 font-medium hover:bg-blue-50 transition"
              onClick={() => setExpanded(true)}
            >
              Daha fazla göster
            </button>
          </>
        )}
        {expanded && (
          <button
            className="absolute left-1/2 -translate-x-1/2 bottom-4 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow border border-gray-200 text-blue-700 font-medium hover:bg-blue-50 transition"
            onClick={() => setExpanded(false)}
          >
            Daha az göster
          </button>
        )}
      </div>

      {/* Teklif İstatistikleri */}
      {offers.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaFilePdf className="text-blue-600" />
            Teklif İstatistikleri
          </h2>
          
          {(() => {
            const stats = getOfferStats();
            const currencyEntries = Object.entries(stats.byCurrency);
            
            return (
              <div className="space-y-6">
                {/* Ana İstatistikler */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-blue-700">Toplam Teklif</div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {Object.keys(stats.byStatus).length}
                    </div>
                    <div className="text-sm text-orange-700">Farklı Durum</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {currencyEntries.length}
                    </div>
                    <div className="text-sm text-purple-700">Para Birimi</div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-indigo-600">
                      {stats.averageValue.toLocaleString('tr-TR')} ₺
                    </div>
                    <div className="text-sm text-indigo-700">Ortalama (TL)</div>
                  </div>
                </div>
                
                {/* Para Birimlerine Göre Toplamlar */}
                {currencyEntries.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Para Birimlerine Göre Toplamlar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currencyEntries.map(([currency, total]) => {
                        const currencySymbols: { [key: string]: string } = {
                          'TRY': '₺',
                          'USD': '$',
                          'EUR': '€',
                          'GBP': '£'
                        };
                        const symbol = currencySymbols[currency] || currency;
                        
                        return (
                          <div key={currency} className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-lg font-bold text-green-700">
                                  {total.toLocaleString('tr-TR')} {symbol}
                                </div>
                                <div className="text-sm text-green-600">{currency}</div>
                              </div>
                              <div className="text-2xl text-green-500">
                                {offers.filter(offer => (offer.currency || 'TRY') === currency).length} teklif
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          
          {/* Durum Dağılımı */}
          {(() => {
            const stats = getOfferStats();
            const statusEntries = Object.entries(stats.byStatus);
            if (statusEntries.length > 0) {
              return (
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Durum Dağılımı</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {statusEntries.map(([statusName, count]) => {
                      const status = statuses.find(s => s.displayName === statusName || s.name === statusName);
                      return (
                        <div key={statusName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: status?.color || '#6B7280' }}
                            ></div>
                            <span className="text-sm font-medium text-gray-700">{statusName}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Teklifler */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Teklifler ({offers.length})</h2>
          <Link href={`/offers/new?patientId=${patientId}`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Yeni Teklif Oluştur
            </Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.map((offer: any) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{offer.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span 
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: `${offer.status?.color || '#6B7280'}20`,
                        color: offer.status?.color || '#6B7280'
                      }}
                    >
                      {offer.status?.displayName || offer.status?.name || 'Bilinmeyen'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(offer.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {offer.totalAmount?.toLocaleString('tr-TR')} {offer.currency}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/offer/${offer.slug}`} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Görüntüle"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaEye className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/offers/${offer.id}/edit`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openDeleteOfferDialog(offer.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showDeletePatientDialog}
        onClose={() => setShowDeletePatientDialog(false)}
        onConfirm={handleDeletePatient}
        title="Hastayı Sil"
        message="Bu hastayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        cancelText="İptal"
        isLoading={deleting}
      />

      <ConfirmDialog
        isOpen={showDeleteOfferDialog}
        onClose={() => setShowDeleteOfferDialog(false)}
        onConfirm={handleDeleteOffer}
        title="Teklifi Sil"
        message="Bu teklifi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        cancelText="İptal"
      />
    </div>
  );
}