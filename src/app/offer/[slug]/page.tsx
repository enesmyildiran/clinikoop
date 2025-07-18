"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { 
  FaLock, 
  FaEye, 
  FaDownload, 
  FaFilePdf, 
  FaUser, 
  FaPhone, 
  FaCalendar, 
  FaKey, 
  FaAsterisk, 
  FaTimes,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaMapMarkerAlt,
  FaEnvelope,
  FaGlobe,
  FaTooth,
  FaClock,
  FaNotesMedical,
  FaCheckCircle,
  FaStar,
  FaHeart,
  FaShieldAlt,
  FaCreditCard,
  FaCalendarCheck,
  FaUserMd,
  FaHospital
} from "react-icons/fa";
import dynamic from 'next/dynamic';

// PDFPreview'i dinamik olarak import et
const PDFPreview = dynamic(() => import("@/components/ui/PDFPreview").then(mod => ({ default: mod.PDFPreview })), {
  ssr: false,
  loading: () => <div className="text-center py-8">PDF yükleniyor...</div>
});

interface OfferData {
  patient: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate?: string;
    gender?: string;
    address?: string;
  };
  clinic: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
    slogan?: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    taxNumber?: string;
  };
  treatments: Array<{
    name: string;
    teeth: number[];
    price: number;
    currency: string;
    notes?: string;
    description?: string;
    duration?: string;
    selectedTeeth?: string;
    estimatedDays?: number;
    estimatedHours?: number;
  }>;
  totalAmount: number;
  currency: string;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
  notes?: string;
  offerDate: string;
  validUntil: string;
  doctor?: string;
  offerId?: string;
}

interface OfferPageProps {
  params: {
    slug: string;
  };
}

// Ad-soyadı maskeleyen fonksiyon (ilk harf açık, kalanlar *)
function maskNameStrict(fullName: string) {
  if (!fullName) return '';
  const parts = fullName.trim().split(' ');
  return parts.map(p => p.length > 1 ? p[0] + '*'.repeat(p.length - 1) : p).join(' ');
}

// Para formatı
function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency || 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  } catch (error) {
    return `${amount || 0} ${currency || 'TRY'}`;
  }
}

// Tarih formatı
function formatDate(dateString: string) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return '';
  }
}

export default function OfferPage({ params }: OfferPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('');
  const [verificationValue, setVerificationValue] = useState('');
  const [userInput, setUserInput] = useState('');
  const [offerData, setOfferData] = useState<OfferData | null>(null);
  const { addToast } = useToast();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadOfferData();
  }, [params.slug]);

  const loadOfferData = async () => {
    try {
      const response = await fetch(`/api/offers/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        
        if (data.offer) {
          const formattedOffer: OfferData = {
            patient: {
              firstName: data.offer.patient.name?.split(' ')[0] || '',
              lastName: data.offer.patient.name?.split(' ').slice(1).join(' ') || '',
              phone: data.offer.patient.phone || '',
              email: data.offer.patient.email || '',
              birthDate: data.offer.patient.birthDate,
              gender: data.offer.patient.gender,
              address: data.offer.patient.address,
            },
            clinic: {
              name: data.clinic?.name || 'Diş Kliniği',
              address: data.clinic?.address || 'Adres bilgisi',
              phone: data.clinic?.phone || 'Telefon bilgisi',
              email: data.clinic?.email || 'Email bilgisi',
              website: data.clinic?.website || 'Website bilgisi',
              logo: data.clinic?.logo,
              slogan: data.clinic?.slogan || 'Sağlıklı gülüşler için',
              facebook: data.clinic?.facebook,
              instagram: data.clinic?.instagram,
              whatsapp: data.clinic?.whatsapp,
              taxNumber: data.clinic?.taxNumber,
            },
            treatments: data.offer.treatments.map((treatment: any) => {
              // selectedTeeth'i güvenli şekilde parse et
              let teeth: number[] = [];
              let selectedTeethStr = '';
              
              if (treatment.selectedTeeth) {
                if (Array.isArray(treatment.selectedTeeth)) {
                  teeth = treatment.selectedTeeth;
                  selectedTeethStr = treatment.selectedTeeth.join(', ');
                } else if (typeof treatment.selectedTeeth === 'string') {
                  try {
                    teeth = JSON.parse(treatment.selectedTeeth);
                    selectedTeethStr = teeth.join(', ');
                  } catch (e) {
                    // Eğer JSON parse edilemezse, string olarak kabul et
                    selectedTeethStr = treatment.selectedTeeth;
                    teeth = [];
                  }
                }
              }
              
              return {
                name: treatment.name,
                teeth: teeth,
                price: treatment.price,
                currency: data.offer.currency,
                notes: treatment.notes,
                description: treatment.description,
                duration: treatment.duration,
                selectedTeeth: selectedTeethStr,
                estimatedDays: treatment.estimatedDays,
                estimatedHours: treatment.estimatedHours,
              };
            }),
            totalAmount: data.offer.totalPrice,
            currency: data.offer.currency,
            vatRate: 20,
            vatAmount: data.offer.totalPrice * 0.2,
            grandTotal: data.offer.totalPrice * 1.2,
            notes: data.offer.notes?.[0]?.content || '',
            offerDate: new Date(data.offer.createdAt).toISOString().split('T')[0],
            validUntil: data.offer.validUntil ? new Date(data.offer.validUntil).toISOString().split('T')[0] : '',
            doctor: data.offer.doctor || 'Dr. Uzman',
            offerId: data.offer.id,
          };
          
          setOfferData(formattedOffer);
          setVerificationMethod(data.verificationMethod || '');
          setVerificationValue(data.verificationValue || '');
        } else {
          addToast({
            message: "Teklif bulunamadı veya süresi dolmuş",
            type: "error"
          });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        addToast({
          message: errorData.error || "Teklif bulunamadı veya süresi dolmuş",
          type: "error"
        });
      }
    } catch (error) {
      console.error('Teklif yükleme hatası:', error);
      addToast({
        message: "Teklif yüklenirken hata oluştu",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = () => {
    if (!userInput.trim()) {
      setHasError(true);
      addToast({
        message: "Doğrulama bilgisini girin",
        type: "error"
      });
      return;
    }

    let isValid = false;
    const input = userInput.trim().toLowerCase();
    const value = (verificationValue || '').trim().toLowerCase();
    
    switch (verificationMethod) {
      case 'phone':
        isValid = input === value;
        break;
      case 'lastName':
        isValid = input === value;
        break;
      case 'birthDate':
        isValid = input === value;
        break;
      case 'custom':
        isValid = input === value;
        break;
      default:
        isValid = false;
    }

    if (isValid) {
      setHasError(false);
      setIsAuthenticated(true);
      addToast({
        message: "Doğrulama başarılı! Teklifinizi görüntüleyebilirsiniz.",
        type: "success"
      });
    } else {
      // Input'u temizle ve hata durumunu aktif et
      setUserInput('');
      setHasError(true);
      
      // Doğrulama yöntemine göre özel hata mesajları
      let errorMessage = '';
      switch (verificationMethod) {
        case 'phone':
          errorMessage = "Telefon numaranızın son 4 hanesi hatalı. Lütfen tekrar deneyin.";
          break;
        case 'lastName':
          errorMessage = "Soyadınız hatalı. Lütfen tekrar deneyin.";
          break;
        case 'birthDate':
          errorMessage = "Doğum tarihiniz hatalı. GG.AA.YYYY formatında girin.";
          break;
        case 'custom':
          errorMessage = "Özel şifreniz hatalı. Lütfen tekrar deneyin.";
          break;
        default:
          errorMessage = "Doğrulama bilgisi hatalı. Lütfen tekrar deneyin.";
      }
      
      addToast({
        message: errorMessage,
        type: "error"
      });
    }
  };

  const getVerificationPlaceholder = () => {
    switch (verificationMethod) {
      case 'phone':
        return 'Telefon numaranızın son 4 hanesini girin';
      case 'lastName':
        return 'Soyadınızı girin';
      case 'birthDate':
        return 'Doğum tarihinizi girin (GG.AA.YYYY)';
      case 'custom':
        return 'Özel şifrenizi girin';
      default:
        return 'Doğrulama bilgisini girin';
    }
  };

  const handleWhatsApp = () => {
    if (mounted && offerData?.clinic.whatsapp) {
      const message = `Merhaba, ${offerData.patient.firstName} ${offerData.patient.lastName} için hazırlanan tedavi teklifi hakkında bilgi almak istiyorum.`;
      const url = `https://wa.me/${offerData.clinic.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  // Server-side rendering sırasında hiçbir şey render etme
  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Teklif yükleniyor...</p>
          <p className="mt-2 text-gray-500 text-sm">Lütfen bekleyin</p>
        </div>
      </div>
    );
  }

  if (!offerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFilePdf className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Teklif Bulunamadı</h2>
            <p className="text-gray-600 mb-6">
              Bu teklif mevcut değil veya süresi dolmuş olabilir.
            </p>
            <Button 
              onClick={() => mounted && window.history.back()} 
              className="w-full"
              variant="outline"
            >
              Geri Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLock className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-800 mb-2 text-center">Teklif Erişimi</h1>
              <p className="text-sm text-gray-600 text-center mb-4">Teklifinizi görüntülemek için doğrulama yapmanız gerekiyor</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Doğrulama Bilgisi
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaAsterisk className="w-5 h-5" />
                  </div>
                  <Input
                    className={`pl-12 h-9 text-xs ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      if (hasError) setHasError(false);
                    }}
                    placeholder={getVerificationPlaceholder()}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
                    type="password"
                  />
                </div>
                {hasError && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <FaTimes className="w-3 h-3" />
                    {verificationMethod === 'phone' && 'Telefon numaranızın son 4 hanesi hatalı'}
                    {verificationMethod === 'lastName' && 'Soyadınız hatalı'}
                    {verificationMethod === 'birthDate' && 'Doğum tarihiniz hatalı'}
                    {verificationMethod === 'custom' && 'Özel şifreniz hatalı'}
                    {!verificationMethod && 'Doğrulama bilgisi hatalı'}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {verificationMethod === 'phone' && 'Telefon numaranızın son 4 hanesini girin'}
                  {verificationMethod === 'lastName' && 'Soyadınızı girin'}
                  {verificationMethod === 'birthDate' && 'Doğum tarihinizi GG.AA.YYYY formatında girin'}
                  {verificationMethod === 'custom' && 'Size verilen özel şifreyi girin'}
                </p>
              </div>

              <Button
                onClick={handleVerification}
                className={`w-full h-10 text-xs font-semibold flex items-center justify-center gap-2 rounded-md mt-2 ${
                  hasError 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                size="sm"
              >
                <FaEye className="w-4 h-4" />
                <span className="inline-block align-middle">Teklifi Görüntüle</span>
              </Button>
            </div>

            {/* Maskelenmiş hasta adı */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="text-center">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm tracking-wider uppercase">Hasta</h4>
                <div className="text-lg text-blue-700 font-bold tracking-widest">
                  {maskNameStrict(`${offerData.patient.firstName} ${offerData.patient.lastName}`)}
                </div>
                <p className="text-xs text-blue-600 mt-1">Güvenli erişim için doğrulama gerekli</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sayfa Başlığı */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Tedavi Teklifi
          </h1>
          <p className="text-gray-600 text-lg">
            {offerData.patient.firstName} {offerData.patient.lastName} için hazırlanmış teklif
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Sol Taraf: Klinik ve Hasta Bilgileri */}
          <div className="xl:col-span-1 space-y-6">
            {/* Klinik Bilgileri */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaHospital className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Diş Kliniği</h3>
                </div>
                {/* Sosyal Medya İkonları */}
                {(offerData.clinic.facebook || offerData.clinic.instagram || offerData.clinic.whatsapp) && (
                  <div className="flex gap-2 mb-2 mt-1">
                    {offerData.clinic.facebook && (
                      <a href={offerData.clinic.facebook} target="_blank" rel="noopener noreferrer" className="w-5 h-5 flex items-center justify-center">
                        <FaFacebook className="w-4 h-4 text-blue-600" />
                      </a>
                    )}
                    {offerData.clinic.instagram && (
                      <a href={offerData.clinic.instagram} target="_blank" rel="noopener noreferrer" className="w-5 h-5 flex items-center justify-center">
                        <FaInstagram className="w-4 h-4 text-pink-500" />
                      </a>
                    )}
                    {offerData.clinic.whatsapp && (
                      <a href={`https://wa.me/${offerData.clinic.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-5 h-5 flex items-center justify-center">
                        <FaWhatsapp className="w-4 h-4 text-green-500" />
                      </a>
                    )}
                  </div>
                )}
                
                {/* Klinik Bilgileri */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">{offerData.clinic.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">+90 {offerData.clinic.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">{offerData.clinic.email}</span>
                  </div>
                  {offerData.clinic.website && (
                    <div className="flex items-center gap-3">
                      <FaGlobe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={offerData.clinic.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
                        {offerData.clinic.name}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hasta Bilgileri */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaUser className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Hasta Bilgileri</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ad Soyad:</span>
                    <span className="font-semibold text-gray-900">
                      {offerData.patient.firstName} {offerData.patient.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Telefon:</span>
                    <span className="font-medium">{offerData.patient.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">E-posta:</span>
                    <span className="font-medium">{offerData.patient.email}</span>
                  </div>
                  {offerData.patient.birthDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Doğum Tarihi:</span>
                      <span className="font-medium">{formatDate(offerData.patient.birthDate)}</span>
                    </div>
                  )}
                  {offerData.patient.gender && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cinsiyet:</span>
                      <span className="font-medium">{offerData.patient.gender}</span>
                    </div>
                  )}
                  {offerData.patient.address && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Adres:</span>
                      <span className="font-medium text-right max-w-xs">{offerData.patient.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Teklif Bilgileri */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaFilePdf className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Teklif Bilgileri</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Teklif ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {offerData.offerId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Teklif Tarihi:</span>
                    <span className="font-medium">{formatDate(offerData.offerDate)}</span>
                  </div>
                  {offerData.validUntil && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Geçerlilik:</span>
                      <span className="font-medium">{formatDate(offerData.validUntil)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Klinik:</span>
                    <span className="font-medium">{offerData.clinic.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orta ve Sağ Taraf: Tedavi Detayları ve Fiyat */}
          <div className="xl:col-span-2 space-y-6">
            {/* Tedavi Detayları */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaTooth className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Tedavi Detayları</h3>
                </div>
                
                <div className="space-y-4">
                  {offerData.treatments.map((treatment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-bold text-gray-900 text-lg">{treatment.name}</h4>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Tedavi Çeşidi</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <FaTooth className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              Diş Numaraları: {treatment.selectedTeeth || '-'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <FaClock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Gereken Süre: {treatment.duration || `${treatment.estimatedDays ? treatment.estimatedDays + ' gün ' : ''}${treatment.estimatedHours ? treatment.estimatedHours + ' saat' : ''}` || '-'}
                            </span>
                          </div>
                          {treatment.description && (
                            <div className="mb-3">
                              <p className="text-gray-600 text-sm">{treatment.description}</p>
                            </div>
                          )}
                          {treatment.notes && (
                            <div className="flex items-start gap-2">
                              <FaNotesMedical className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-sm font-medium text-gray-700">Notlar:</span>
                                <p className="text-sm text-gray-600 italic mt-1">&quot;{treatment.notes}&quot;</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(treatment.price, treatment.currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fiyat Özeti */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Fiyat Özeti</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Ara Toplam:</span>
                    <span className="font-semibold">{formatCurrency(offerData.totalAmount, offerData.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">KDV (%{offerData.vatRate}):</span>
                    <span className="font-semibold">{formatCurrency(offerData.vatAmount, offerData.currency)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Genel Toplam:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(offerData.grandTotal, offerData.currency)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <FaCheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Bu fiyat teklifi {offerData.validUntil ? formatDate(offerData.validUntil) : '30 gün'} geçerlidir</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notlar */}
            {offerData.notes && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FaNotesMedical className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Önemli Notlar</h3>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{offerData.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button
                onClick={() => setShowPdfPreview(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-10 text-sm font-semibold rounded-md shadow px-4 min-w-[140px]"
                size="sm"
              >
                <FaDownload className="w-4 h-4" />
                <span>PDF İndir</span>
              </Button>
              {offerData.clinic.whatsapp && (
                <Button
                  onClick={handleWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 h-10 text-sm font-semibold rounded-md shadow px-4 min-w-[140px]"
                  size="sm"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>WhatsApp</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {mounted && showPdfPreview && offerData && (
        <PDFPreview data={offerData} onClose={() => setShowPdfPreview(false)} />
      )}
    </div>
  );
} 