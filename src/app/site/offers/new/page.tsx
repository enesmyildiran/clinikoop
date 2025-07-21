"use client"

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { FaWhatsapp, FaInstagram, FaFacebook, FaUser, FaEnvelope, FaPhone, FaFilePdf, FaPlus, FaSearch } from "react-icons/fa";
import { SocialMediaInputs } from "@/components/ui/SocialMediaInputs";
import { Checkbox } from "@/components/ui/Checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { ToothSelector } from "@/components/ui/ToothSelector";
import { ToothPricingInput } from "@/components/ui/ToothPricingInput";
import { PDFPreview } from "@/components/ui/PDFPreview";
import { useToast } from "@/components/ui/Toast";
import { PageContainer } from "@/components/ui/PageContainer";
import { useClinic } from '@/contexts/ClinicContext'

const steps = [
  { label: "Hasta Bilgileri" },
  { label: "Tedavi Seçimi" },
  { label: "Tedavi Detayları" },
  { label: "Teklif Özeti & Notlar" },
  { label: "Onay & Gönder" },
];

const TREATMENT_CATEGORIES = [
  {
    key: "aesthetic",
    label: "Estetik",
    treatments: [
      { key: "zirconium-crown", name: "Zirconium Crown" },
      { key: "laminate-veneer", name: "Laminate Veneer" },
      { key: "e-max-crown", name: "E-Max Crown" },
      { key: "teeth-whitening", name: "Teeth Whitening" },
      { key: "smile-design", name: "Smile Design" },
      { key: "hollywood-smile", name: "Hollywood Smile" },
    ],
  },
  {
    key: "implant",
    label: "İmplant",
    treatments: [
      { key: "dental-implant", name: "Dental Implant" },
      { key: "all-on-4", name: "All-on-4 Implant Treatment" },
      { key: "all-on-6", name: "All-on-6 Implant Treatment" },
      { key: "sinus-lifting", name: "Sinus Lifting" },
      { key: "bone-grafting", name: "Bone Grafting" },
      { key: "temporary-crown", name: "Temporary Crown" },
      { key: "full-mouth-rehab", name: "Full Mouth Rehabilitation" },
    ],
  },
  {
    key: "surgical",
    label: "Cerrahi",
    treatments: [
      { key: "tooth-extraction", name: "Tooth Extraction" },
      { key: "surgical-tooth-extraction", name: "Surgical Tooth Extraction" },
      { key: "wisdom-tooth-extraction", name: "Wisdom Tooth Extraction" },
    ],
  },
  {
    key: "restorative",
    label: "Restoratif",
    treatments: [
      { key: "composite-filling", name: "Composite Filling" },
      { key: "inlay-onlay-filling", name: "Inlay / Onlay Filling" },
      { key: "dental-bridge", name: "Dental Bridge" },
      { key: "root-canal-treatment", name: "Root Canal Treatment" },
    ],
  },
  {
    key: "prosthetics",
    label: "Protez",
    treatments: [
      { key: "removable-denture", name: "Removable Denture" },
      { key: "fixed-denture", name: "Fixed Denture" },
    ],
  },
  {
    key: "orthodontics",
    label: "Ortodonti",
    treatments: [
      { key: "orthodontic-treatment", name: "Orthodontic Treatment (Braces)" },
      { key: "clear-aligner", name: "Clear Aligner (Invisalign)" },
    ],
  },
  {
    key: "general",
    label: "Genel & Diğer",
    treatments: [
      { key: "periodontal-treatment", name: "Periodontal Treatment" },
      { key: "night-guard", name: "Night Guard" },
      { key: "pediatric-dental-treatment", name: "Pediatric Dental Treatment" },
    ],
  },
];

// Tedavi detayları için interface
interface ToothPricing {
  toothNumber: number;
  price: number;
  currency: string;
  vatRate: number;
  vatAmount: number;
  totalPrice: number;
}

interface TreatmentDetail {
  treatmentKey: string;
  treatmentName: string;
  selectedTeeth: number[];
  toothPricing: ToothPricing[];
  notes: string;
  estimatedDays?: number;
  estimatedHours?: number;
}

export default function OfferCreatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [patientInfo, setPatientInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    birthDate: "",
    address: "",
    specialNotes: "",
  });
  const [patientErrors, setPatientErrors] = useState<any>({});
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  const submissionRef = useRef(false);
  
  // Güçlü çift tıklama engelleme için ek flag
  const isProcessingRef = useRef(false);
  
  const [pdfTemplates, setPdfTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [verificationMethod, setVerificationMethod] = useState('phone');
  const [verificationValue, setVerificationValue] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [validUntil, setValidUntil] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  const { addToast } = useToast();
  const { clinic } = useClinic();

  // Tedavi seçimi için state
  const [treatmentSearch, setTreatmentSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

  // Tüm tedavileri düz liste olarak çıkar
  const allTreatments = TREATMENT_CATEGORIES.flatMap(cat =>
    cat.treatments.map(t => ({ ...t, category: cat.key, categoryLabel: cat.label }))
  );

  // Kategori ve aramaya göre filtrele
  const filteredTreatments = allTreatments.filter(t =>
    (activeCategory === "all" || t.category === activeCategory) &&
    t.name.toLowerCase().includes(treatmentSearch.toLowerCase())
  );

  // Tedavi detayları için state
  const [treatmentDetails, setTreatmentDetails] = useState<TreatmentDetail[]>([]);

  // Basit buton deaktif etme sistemi
  const [offerSent, setOfferSent] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Doğrulama değerini otomatik hesapla
  useEffect(() => {
    let value = '';
    
    switch (verificationMethod) {
      case 'phone':
        value = patientInfo.phone?.slice(-4) || '';
        break;
      case 'lastName':
        value = patientInfo.lastName || '';
        break;
      case 'birthDate':
        value = patientInfo.birthDate || '';
        break;
      case 'custom':
        // Özel şifre için kullanıcı girişi gerekli, boş bırak
        break;
    }
    
    setVerificationValue(value);
  }, [verificationMethod, patientInfo.phone, patientInfo.lastName, patientInfo.birthDate]);

  // Hastaları yükle
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/patients');
        const data = await res.json();
        setPatients(data.patients || []);
      } catch (error) {
        console.error('Hastalar yüklenirken hata:', error);
      }
    };
    fetchPatients();
  }, []);

  // URL'den patientId al ve hasta bilgilerini doldur
  useEffect(() => {
    const patientId = searchParams.get('patientId');
    if (patientId) {
      setSelectedPatientId(patientId);
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        fillPatientInfo(patient);
      }
    }
  }, [searchParams, patients]);

  // Hasta bilgilerini doldur
  const fillPatientInfo = (patient: any) => {
    console.log('Hasta verileri dolduruluyor:', patient);
    
    // İsimi parçala
    const nameParts = patient.name?.split(' ') || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(' ') || "";
    
    // Doğum tarihini formatla
    let birthDate = "";
    if (patient.birthDate) {
      try {
        birthDate = new Date(patient.birthDate).toISOString().split('T')[0];
      } catch (error) {
        console.error('Doğum tarihi formatlanamadı:', patient.birthDate);
      }
    }
    
    setPatientInfo({
      firstName: firstName,
      lastName: lastName,
      phone: patient.phone || "",
      email: patient.email || "",
      birthDate: birthDate,
      address: patient.address || "",
      specialNotes: patient.notes || "",
    });
    
    // Sosyal medya verilerini doldur
    setSocials({
      instagram: patient.instagram || "",
      facebook: patient.facebook || "",
      whatsapp: patient.whatsapp || "",
    });
    
    console.log('Doldurulan hasta bilgileri:', {
      firstName,
      lastName,
      phone: patient.phone,
      email: patient.email,
      birthDate,
      address: patient.address,
      socials: {
        instagram: patient.instagram,
        facebook: patient.facebook,
        whatsapp: patient.whatsapp,
      }
    });
  };

  // Hasta seçimi değiştiğinde
  const handlePatientChange = (patientId: string) => {
    console.log('Hasta seçimi değişti:', patientId);
    setSelectedPatientId(patientId);
    if (patientId === "new") {
      // Yeni hasta seçildi, formu temizle
      setPatientInfo({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        birthDate: "",
        address: "",
        specialNotes: "",
      });
      setSocials({});
    } else {
      // Mevcut hasta seçildi, bilgileri doldur
      const patient = patients.find(p => p.id === patientId);
      console.log('Bulunan hasta:', patient);
      if (patient) {
        fillPatientInfo(patient);
      }
    }
  };

  // PDF şablonlarını API'den çek
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const res = await fetch("/api/pdf-templates");
        const data = await res.json();
        if (data.success) {
          setPdfTemplates(data.data);
          // Varsayılan şablonu seçili yap
          const defaultTpl = data.data.find((tpl: any) => tpl.isDefault);
          setSelectedTemplate(defaultTpl ? defaultTpl.id : data.data[0]?.id || "");
        }
      } catch (e) {
        setPdfTemplates([]);
      }
      setLoadingTemplates(false);
    };
    fetchTemplates();
  }, []);

  // Tedavi detaylarını güncelle
  const updateTreatmentDetail = (treatmentKey: string, field: keyof TreatmentDetail, value: any) => {
    setTreatmentDetails(prev => 
      prev.map(detail => 
        detail.treatmentKey === treatmentKey 
          ? { ...detail, [field]: value }
          : detail
      )
    );
  };

  // Tedavi detaylarını başlat
  React.useEffect(() => {
    if (selectedTreatments.length > 0) {
      const newDetails = selectedTreatments.map(key => {
        const existing = treatmentDetails.find(d => d.treatmentKey === key);
        if (existing) return existing;
        
        const treatment = allTreatments.find(t => t.key === key);
        return {
          treatmentKey: key,
          treatmentName: treatment?.name || '',
          selectedTeeth: [],
          toothPricing: [],
          notes: '',
          estimatedDays: 0,
          estimatedHours: 0,
        };
      });
      setTreatmentDetails(newDetails);
    }
  }, [selectedTreatments]);

  // Tedavi detayları validasyonu
  const validateTreatmentDetails = () => {
    if (treatmentDetails.length === 0) return "En az bir tedavi seçilmelidir.";
    
    for (const detail of treatmentDetails) {
      if (detail.selectedTeeth.length === 0) return `${detail.treatmentName} için diş seçimi yapılmalıdır.`;
      if (detail.toothPricing.length === 0) return `${detail.treatmentName} için fiyatlandırma yapılmalıdır.`;
      
      // Her diş için fiyat kontrolü
      for (const pricing of detail.toothPricing) {
        if (pricing.price <= 0) return `${detail.treatmentName} - Diş ${pricing.toothNumber} için fiyat girilmelidir.`;
      }
    }
    return null;
  };

  // Step ileri
  const handleNext = () => {
    if (step === 0) {
      const errors = validatePatientInfo();
      setPatientErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    if (step === 1) {
      if (validateTreatments()) return;
    }
    if (step === 2) {
      if (validateTreatmentDetails()) return;
    }
    setStep((s) => s + 1);
  };
  // Step geri
  const handleBack = () => setStep((s) => (s > 0 ? s - 1 : 0));

  // Teklif kaydetme fonksiyonu (sadece taslak)
  const handleSaveOffer = async () => {
    // Güçlü çoklu koruma: tüm flag'leri kontrol et
    if (submissionRef.current || isSubmitting || submissionInProgress || isProcessingRef.current) {
      console.log('İşlem devam ediyor, çift tıklama engellendi (tüm flag\'ler)');
      return;
    }
    
    console.log('Teklif kaydetme başladı - timestamp:', Date.now());
    
    // Anında tüm koruma mekanizmalarını aktif et
    submissionRef.current = true;
    isProcessingRef.current = true;
    setIsSubmitting(true);
    setSubmissionInProgress(true);
    
    try {
      const offerData = {
        patientInfo,
        treatmentDetails,
        socials,
        status: 'draft',
        createdAt: new Date().toISOString(),
        selectedTemplate,
        verificationMethod,
        verificationValue,
        validUntil,
      };

      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(clinic?.id ? { 'x-clinic-id': clinic.id } : {})
        },
        body: JSON.stringify(offerData),
      });

      const result = await response.json();

      if (result.success) {
        addToast({ message: 'Teklif taslak olarak kaydedildi!', type: 'success' });
        // Başarı sayfasını göster
        setSuccessData({
          patientName: `${patientInfo.firstName} ${patientInfo.lastName}`,
          offerId: result.offer?.id || '',
          offerSlug: result.offer?.slug || '',
          date: new Date().toLocaleDateString('tr-TR'),
        });
        setShowSuccess(true);
      } else {
        addToast({ message: 'Teklif kaydedilirken hata oluştu.', type: 'error' });
      }
    } catch (error) {
      console.error('Teklif kaydetme hatası:', error);
      addToast({ message: 'Teklif kaydedilirken hata oluştu.', type: 'error' });
    } finally {
      console.log('Teklif kaydetme tamamlandı, koruma mekanizmaları sıfırlanıyor - timestamp:', Date.now());
      // Tüm koruma mekanizmalarını sıfırla
      submissionRef.current = false;
      isProcessingRef.current = false;
      setIsSubmitting(false);
      setSubmissionInProgress(false);
    }
  };

  // Teklif gönderme fonksiyonu (mevcut teklifi güncelle)
  const handleSendOffer = async () => {
    // Güçlü çoklu koruma: tüm flag'leri kontrol et
    if (submissionRef.current || isSubmitting || submissionInProgress || isProcessingRef.current) {
      console.log('İşlem devam ediyor, çift tıklama engellendi (tüm flag\'ler)');
      return;
    }
    
    if (!verificationValue.trim()) {
      addToast({ message: 'Doğrulama bilgisi girilmelidir.', type: 'error' });
      return;
    }

    console.log('Teklif gönderme başladı - timestamp:', Date.now());
    
    // Anında tüm koruma mekanizmalarını aktif et
    submissionRef.current = true;
    isProcessingRef.current = true;
    setIsSubmitting(true);
    setSubmissionInProgress(true);
    
    try {
      // Önce teklifi taslak olarak kaydet (eğer henüz kaydedilmemişse)
      const offerData = {
        patientInfo,
        treatmentDetails,
        socials,
        status: 'draft',
        createdAt: new Date().toISOString(),
        selectedTemplate,
        verificationMethod,
        verificationValue,
        validUntil,
      };

      console.log('Teklif verisi:', offerData);

      const createResponse = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(clinic?.id ? { 'x-clinic-id': clinic.id } : {})
        },
        body: JSON.stringify(offerData),
      });

      const createResult = await createResponse.json();
      console.log('Teklif oluşturma sonucu:', createResult);

      if (!createResult.success) {
        addToast({ message: 'Teklif oluşturulurken hata oluştu.', type: 'error' });
        return;
      }

      // "sent" durumunun ID'sini bul
      const statusResponse = await fetch('/api/offer-statuses');
      const statusData = await statusResponse.json();
      
      if (!statusData.success || !statusData.statuses) {
        addToast({ message: 'Durum bilgileri alınamadı.', type: 'error' });
        return;
      }
      
      const sentStatus = statusData.statuses.find((s: any) => s.name === 'sent' || s.displayName === 'Gönderildi');
      
      if (!sentStatus) {
        addToast({ message: 'Gönderildi durumu bulunamadı.', type: 'error' });
        return;
      }

      // Şimdi teklifi güncelle ve gönder
      const updateData = {
        statusId: sentStatus.id,
      };

      const updateResponse = await fetch(`/api/offers/${createResult.offer.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(clinic?.id ? { 'x-clinic-id': clinic.id } : {})
        },
        body: JSON.stringify(updateData),
      });

      const updateResult = await updateResponse.json();
      console.log('Teklif güncelleme sonucu:', updateResult);

      if (updateResult.success) {
        // Link oluştur
        const baseUrl = window.location.origin;
        const offerLink = `${baseUrl}/site/offer/${createResult.offer.slug}`;
        setGeneratedLink(offerLink);
        
        addToast({ message: 'Teklif başarıyla gönderildi!', type: 'success' });
        setOfferSent(true);
        
        // Başarı sayfasını göster
        setSuccessData({
          patientName: `${patientInfo.firstName} ${patientInfo.lastName}`,
          offerId: createResult.offer?.id || '',
          offerSlug: createResult.offer?.slug || '',
          date: new Date().toLocaleDateString('tr-TR'),
        });
        setShowSuccess(true);
      } else {
        addToast({ message: 'Teklif gönderilirken hata oluştu.', type: 'error' });
      }
    } catch (error) {
      console.error('Teklif gönderme hatası:', error);
      addToast({ message: 'Teklif gönderilirken hata oluştu.', type: 'error' });
    } finally {
      console.log('Teklif gönderme tamamlandı, koruma mekanizmaları sıfırlanıyor - timestamp:', Date.now());
      // Tüm koruma mekanizmalarını sıfırla
      submissionRef.current = false;
      isProcessingRef.current = false;
      setIsSubmitting(false);
      setSubmissionInProgress(false);
    }
  };

  // Buton wrapper fonksiyonları - ekstra koruma için
  const handleSaveOfferClick = () => {
    if (submissionRef.current || isSubmitting || submissionInProgress || isProcessingRef.current) {
      console.log('Buton tıklaması engellendi - işlem devam ediyor (tüm flag\'ler)');
      return;
    }
    handleSaveOffer();
  };

  const handleSendOfferClick = () => {
    if (submissionRef.current || isSubmitting || submissionInProgress || isProcessingRef.current) {
      console.log('Buton tıklaması engellendi - işlem devam ediyor (tüm flag\'ler)');
      return;
    }
    handleSendOffer();
  };

  // Link kopyalama fonksiyonu
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      addToast({ message: 'Link panoya kopyalandı!', type: 'success' });
    } catch (error) {
      addToast({ message: 'Link kopyalanamadı.', type: 'error' });
    }
  };

  // Hasta Bilgileri validasyonu
  const validatePatientInfo = () => {
    const errors: any = {};
    if (!patientInfo.firstName) errors.firstName = "Ad zorunlu";
    if (!patientInfo.lastName) errors.lastName = "Soyad zorunlu";
    if (!patientInfo.phone) errors.phone = "Telefon zorunlu";
    if (!patientInfo.email) errors.email = "E-posta zorunlu";
    return errors;
  };

  // Tedavi seçimi validasyonu (örnek)
  const validateTreatments = () => {
    return selectedTreatments.length === 0 ? "En az bir tedavi seçmelisiniz" : "";
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  // Başarı sayfası
  if (showSuccess && successData) {
    return (
      <PageContainer>
        <div className="w-full max-w-md mx-auto py-16 text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 shadow">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Teklif başarıyla gönderildi!</h2>
            <div className="text-gray-700 mb-4">
              <div><b>Hasta:</b> {successData.patientName}</div>
              <div><b>Teklif No:</b> {successData.offerId}</div>
              <div><b>Tarih:</b> {successData.date}</div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <Button onClick={() => router.push(`/site/patients/${selectedPatientId}`)} className="w-full">Hasta Profili&apos;ne Git</Button>
              <Button onClick={() => router.push('/site/offers')} variant="outline" className="w-full">Teklifler Listesine Dön</Button>
              <Button onClick={() => router.push('/site/offers/new')} variant="ghost" className="w-full">Yeni Teklif Oluştur</Button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Yeni Teklif Oluştur</h1>
        <p className="text-gray-600">Hasta için yeni bir tedavi teklifi oluşturun</p>
      </div>

      <Card className="w-full">
        <CardContent className="p-6 sm:p-8 md:p-10">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, idx) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setStep(idx)}
                className={cn(
                  "flex-1 flex flex-col items-center group transition",
                  idx !== steps.length - 1 && "pr-2"
                )}
                tabIndex={0}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-1 border-2 transition font-bold shadow-sm",
                    step === idx
                      ? "bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300"
                      : "bg-white text-gray-400 border-gray-300 group-hover:border-primary"
                  )}
                >
                  {idx + 1}
                </div>
                <span
                  className={cn(
                    "text-xs text-center font-medium transition",
                    step === idx
                      ? "text-primary"
                      : "text-gray-500 group-hover:text-primary"
                  )}
                >
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          {/* Adım 1: Hasta Bilgileri */}
          {step === 0 && (
            <form
              className="space-y-6"
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleNext();
              }}
            >
              {/* Hasta Seçimi */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">Hasta Seçimi</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Mevcut Hasta Seçin veya Yeni Hasta Oluşturun</label>
                    <Select value={selectedPatientId} onValueChange={handlePatientChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Hasta seçin..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">
                          <div className="flex items-center gap-2">
                            <FaPlus className="text-blue-600" />
                            <span>+ Yeni Hasta Oluştur</span>
                          </div>
                        </SelectItem>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            <div className="flex items-center gap-2">
                              <FaUser className="text-gray-400" />
                              <span>{patient.name}</span>
                              <span className="text-sm text-gray-500">({patient.phone})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedPatientId && selectedPatientId !== "new" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-blue-800">
                        <FaUser />
                        <span className="font-medium">Seçilen Hasta: {patients.find(p => p.id === selectedPatientId)?.name}</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">
                        Hasta bilgileri otomatik olarak dolduruldu. Gerekirse düzenleyebilirsiniz.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Ad */}
                <div>
                  <label className="block text-sm font-medium mb-1">Ad</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      className="pl-10"
                      value={patientInfo.firstName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPatientInfo({ ...patientInfo, firstName: e.target.value })
                      }
                      error={patientErrors.firstName}
                      required
                    />
                  </div>
                </div>
                {/* Soyad */}
                <div>
                  <label className="block text-sm font-medium mb-1">Soyad</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      className="pl-10"
                      value={patientInfo.lastName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPatientInfo({ ...patientInfo, lastName: e.target.value })
                      }
                      error={patientErrors.lastName}
                      required
                    />
                  </div>
                </div>
                {/* Telefon */}
                <div>
                  <label className="block text-sm font-medium mb-1">Telefon</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      className="pl-10"
                      value={patientInfo.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPatientInfo({ ...patientInfo, phone: e.target.value })
                      }
                      error={patientErrors.phone}
                      required
                    />
                  </div>
                </div>
                {/* E-posta */}
                <div>
                  <label className="block text-sm font-medium mb-1">E-posta</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      className="pl-10"
                      value={patientInfo.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPatientInfo({ ...patientInfo, email: e.target.value })
                      }
                      error={patientErrors.email}
                      required
                    />
                  </div>
                </div>
                {/* Doğum Tarihi */}
                <div>
                  <label className="block text-sm font-medium mb-1">Doğum Tarihi</label>
                  <Input
                    type="date"
                    value={patientInfo.birthDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPatientInfo({ ...patientInfo, birthDate: e.target.value })
                    }
                  />
                </div>
                {/* Adres */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium mb-1">Adres</label>
                  <Textarea
                    value={patientInfo.address}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setPatientInfo({ ...patientInfo, address: e.target.value })
                    }
                    placeholder="Hasta adresini girin..."
                    rows={3}
                  />
                </div>
              </div>
              {/* Özel Notlar */}
              <div>
                <label className="block text-sm font-medium mb-1">Özel Notlar</label>
                <Textarea
                  value={patientInfo.specialNotes}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setPatientInfo({ ...patientInfo, specialNotes: e.target.value })
                  }
                  placeholder="Hasta hakkında özel notlar..."
                  rows={3}
                />
              </div>
              {/* Sosyal Medya Dinamik Alanı */}
              <div>
                <label className="block text-sm font-medium mb-2">Sosyal Medya</label>
                <SocialMediaInputs value={socials} onChange={setSocials} />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">İleri</Button>
              </div>
            </form>
          )}

          {/* Adım 2: Tedavi Seçimi */}
          {step === 1 && (
            <div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  {/* Kategori Filtreleri */}
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    <Button
                      variant={activeCategory === "all" ? "primary" : "outline"}
                      onClick={() => setActiveCategory("all")}
                      size="sm"
                    >
                      Tümü
                    </Button>
                    {TREATMENT_CATEGORIES.map(cat => (
                      <Button
                        key={cat.key}
                        variant={activeCategory === cat.key ? "primary" : "outline"}
                        onClick={() => setActiveCategory(cat.key)}
                        size="sm"
                      >
                        {cat.label}
                      </Button>
                    ))}
                  </div>
                  {/* Arama */}
                  <div className="mb-4">
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                      placeholder="Tedavi ara..."
                      value={treatmentSearch}
                      onChange={e => setTreatmentSearch(e.target.value)}
                    />
                  </div>
                  {/* Tedavi Listesi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredTreatments.length === 0 && (
                      <div className="text-gray-400 col-span-2">Sonuç bulunamadı.</div>
                    )}
                    {filteredTreatments.map(treatment => (
                      <Card key={treatment.key} className="flex items-center gap-3 px-4 py-3">
                        <Checkbox
                          checked={selectedTreatments.includes(treatment.key)}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) setSelectedTreatments([...selectedTreatments, treatment.key]);
                            else setSelectedTreatments(selectedTreatments.filter(k => k !== treatment.key));
                          }}
                        />
                        <div>
                          <div className="font-medium">{treatment.name}</div>
                          {/* <div className="text-xs text-gray-500">{treatment.description}</div> */}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                {/* Seçilenler Özeti */}
                <div className="w-full md:w-64 shrink-0">
                  <div className="font-semibold mb-2">Seçilen Tedaviler</div>
                  <div className="space-y-2">
                    {selectedTreatments.length === 0 && <div className="text-gray-400 text-sm">Henüz seçim yok.</div>}
                    {selectedTreatments.map(key => {
                      const t = allTreatments.find(t => t.key === key);
                      return (
                        <Card key={key} className="flex items-center justify-between px-3 py-2">
                          <span>{t?.name}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedTreatments(selectedTreatments.filter(k => k !== key))}
                            aria-label="Kaldır"
                          >
                            ×
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {validateTreatments() && (
                <div className="text-red-500 text-sm mt-2">{validateTreatments()}</div>
              )}
              
              <div className="flex justify-between pt-6">
                <Button variant="secondary" onClick={handleBack} type="button">
                  Geri
                </Button>
                <Button onClick={handleNext} type="button" disabled={!!validateTreatments()}>
                  İleri
                </Button>
              </div>
            </div>
          )}

          {/* Adım 3: Tedavi Detayları */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tedavi Detayları
                </h3>
                <p className="text-gray-600">
                  Her tedavi için detayları doldurun
                </p>
              </div>

              {treatmentDetails.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Henüz tedavi seçilmedi. Önceki adıma dönüp tedavi seçimi yapın.
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {treatmentDetails.map((detail, index) => (
                    <AccordionItem key={detail.treatmentKey} value={detail.treatmentKey}>
                      <AccordionTrigger className="px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">
                              {index + 1}.
                            </span>
                            <span className="font-medium">{detail.treatmentName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {detail.selectedTeeth.length > 0 && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {detail.selectedTeeth.length} diş
                              </span>
                            )}
                            {detail.toothPricing.length > 0 && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                {parseFloat(detail.toothPricing.reduce((sum, tp) => sum + tp.totalPrice, 0).toFixed(2))} TRY
                              </span>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-4 space-y-6">
                        {/* Diş Seçimi */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Diş Seçimi *
                          </label>
                          <ToothSelector
                            selectedTeeth={detail.selectedTeeth}
                            onTeethChange={(teeth) => updateTreatmentDetail(detail.treatmentKey, 'selectedTeeth', teeth)}
                          />
                        </div>

                        {/* Diş Bazında Fiyatlandırma */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Fiyatlandırma *
                          </label>
                          <ToothPricingInput
                            selectedTeeth={detail.selectedTeeth}
                            toothPricing={detail.toothPricing}
                            onToothPricingChange={(newToothPricing) => updateTreatmentDetail(detail.treatmentKey, 'toothPricing', newToothPricing)}
                          />
                        </div>

                        {/* Tahmini Süre */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tahmini Süre
                            </label>
                            <div className="flex gap-2 items-end">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Gün</label>
                                <Input
                                  type="number"
                                  min={0}
                                  value={detail.estimatedDays || 0}
                                  onChange={e => updateTreatmentDetail(detail.treatmentKey, 'estimatedDays', Number(e.target.value))}
                                  className="w-20"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Saat</label>
                                <Input
                                  type="number"
                                  min={0}
                                  max={23}
                                  value={detail.estimatedHours || 0}
                                  onChange={e => updateTreatmentDetail(detail.treatmentKey, 'estimatedHours', Number(e.target.value))}
                                  className="w-20"
                                />
                              </div>
                              <span className="text-xs text-gray-400 mb-2">Örnek: 2 gün 3 saat</span>
                            </div>
                          </div>
                          
                          
                        </div>

                        {/* Notlar */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notlar ve Açıklamalar
                          </label>
                          <Textarea
                            value={detail.notes}
                            onChange={(e) => updateTreatmentDetail(detail.treatmentKey, 'notes', e.target.value)}
                            placeholder="Tedavi ile ilgili özel notlar, açıklamalar veya hasta bilgileri..."
                            rows={3}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              {validateTreatmentDetails() && (
                <div className="text-red-500 text-sm mt-2">{validateTreatmentDetails()}</div>
              )}

              <div className="flex justify-between pt-6">
                <Button variant="secondary" onClick={handleBack} type="button">
                  Geri
                </Button>
                <Button onClick={handleNext} type="button" disabled={!!validateTreatmentDetails()}>
                  İleri
                </Button>
              </div>
            </div>
          )}

          {/* Adım 4: Teklif Özeti & Notlar */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Teklif Özeti & Notlar
                </h3>
                <p className="text-gray-600">
                  Teklif detaylarını gözden geçirin ve özel notlar ekleyin
                </p>
              </div>

              {/* Hasta Bilgileri Özeti */}
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Hasta Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Ad Soyad:</span>
                    <p className="font-medium">{patientInfo.firstName} {patientInfo.lastName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Telefon:</span>
                    <p className="font-medium">{patientInfo.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">E-posta:</span>
                    <p className="font-medium">{patientInfo.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Sosyal Medya:</span>
                    <p className="font-medium">
                      {Object.keys(socials).length > 0 
                        ? Object.entries(socials).map(([key, value]) => value).filter(Boolean).join(', ')
                        : 'Belirtilmemiş'
                      }
                    </p>
                  </div>
                </div>
              </Card>

              {/* Tedavi Özeti */}
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Seçilen Tedaviler</h4>
                <div className="space-y-3">
                  {treatmentDetails.map((detail, index) => (
                    <div key={detail.treatmentKey} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">{index + 1}.</span>
                        <div>
                          <p className="font-medium">{detail.treatmentName}</p>
                          {detail.estimatedDays !== undefined && detail.estimatedHours !== undefined && (detail.estimatedDays > 0 || detail.estimatedHours > 0) && (
                            <p className="text-sm text-gray-600">
                              {detail.estimatedDays > 0 ? `${detail.estimatedDays} gün ` : ''}{detail.estimatedHours > 0 ? `${detail.estimatedHours} saat` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600 mt-1">
                          Toplam: {parseFloat(detail.toothPricing.reduce((sum, tp) => sum + tp.totalPrice, 0).toFixed(2))} {detail.toothPricing[0]?.currency || 'TRY'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="border-t pt-4">
                    {(() => {
                      // Tüm para birimlerini kontrol et
                      const allCurrencies = treatmentDetails.flatMap(detail => 
                        detail.toothPricing.map(tp => tp.currency)
                      );
                      const uniqueCurrencies = Array.from(new Set(allCurrencies));
                      
                      if (uniqueCurrencies.length > 1) {
                        // Farklı para birimleri varsa uyarı göster
                        return (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-yellow-800">Farklı Para Birimleri:</span>
                              <span className="text-sm text-yellow-700">
                                {uniqueCurrencies.join(', ')}
                              </span>
                            </div>
                            <p className="text-xs text-yellow-600 mt-1">
                              Farklı para birimleri olduğu için genel toplam hesaplanamıyor.
                            </p>
                          </div>
                        );
                      } else if (uniqueCurrencies.length === 1) {
                        // Aynı para birimi varsa toplamı hesapla
                        const currency = uniqueCurrencies[0];
                        const total = treatmentDetails.reduce((sum, detail) => 
                          sum + detail.toothPricing.reduce((sum, tp) => sum + tp.totalPrice, 0), 0
                        );
                        
                        return (
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">Genel Toplam:</span>
                            <span className="text-xl font-bold text-green-600">
                              {parseFloat(total.toFixed(2))} {currency}
                            </span>
                          </div>
                        );
                      } else {
                        // Hiç fiyat yoksa
                        return (
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">Genel Toplam:</span>
                            <span className="text-gray-500">Fiyat girilmemiş</span>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </Card>

              {/* Teklif Geçerlilik Süresi */}
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Teklif Geçerlilik Süresi</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bu teklif hangi tarihe kadar geçerli olsun?
                  </label>
                  <Input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">
                      Teklif bu tarihe kadar geçerli olacak. Varsayılan olarak 30 gün sonrası seçilmiştir.
                    </span>
                  </div>
                </div>
              </Card>

              {/* Özel Notlar */}
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Özel Notlar</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hasta ile ilgili önemli notlar, görüşme detayları vb.
                  </label>
                  <Textarea
                    value={patientInfo.specialNotes}
                    onChange={(e) => setPatientInfo({ ...patientInfo, specialNotes: e.target.value })}
                    placeholder="Hasta ile ilgili önemli notlar, görüşme detayları vb."
                    rows={6}
                    maxLength={1000}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      Bu notlar sadece klinik personeli tarafından görülebilir
                    </span>
                    <span className="text-xs text-gray-500">
                      {patientInfo.specialNotes.length}/1000
                    </span>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between pt-6">
                <Button variant="secondary" onClick={handleBack} type="button">
                  Geri
                </Button>
                <Button onClick={handleNext} type="button">
                  İleri
                </Button>
              </div>
            </div>
          )}

          {/* Adım 5: Onay & Gönder */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Onay & Gönder
                </h3>
                <p className="text-gray-600">
                  Teklif detaylarını gözden geçirin ve PDF olarak gönderin
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sol Taraf: Teklif Özeti */}
                <div className="space-y-4">
                  <Card className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Teklif Özeti</h4>
                    
                    {/* Hasta Bilgileri */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Hasta Bilgileri</h5>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium">{patientInfo.firstName} {patientInfo.lastName}</p>
                        <p className="text-sm text-gray-600">{patientInfo.phone}</p>
                        <p className="text-sm text-gray-600">{patientInfo.email}</p>
                      </div>
                    </div>

                    {/* Tedavi Özeti */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Tedavi Detayları</h5>
                      <div className="space-y-2">
                        {treatmentDetails.map((detail, index) => (
                          <div key={detail.treatmentKey} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{detail.treatmentName}</span>
                              <span className="text-sm text-gray-500">
                                {detail.selectedTeeth.length} diş
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Diş: {detail.selectedTeeth.join(', ')}</p>
                              {detail.estimatedDays !== undefined && detail.estimatedHours !== undefined && (detail.estimatedDays > 0 || detail.estimatedHours > 0) && (
                                <p className="font-medium text-green-600 mt-1">
                                  {detail.estimatedDays > 0 ? `${detail.estimatedDays} gün ` : ''}{detail.estimatedHours > 0 ? `${detail.estimatedHours} saat` : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Genel Toplam */}
                    <div className="border-t pt-4">
                      {(() => {
                        // Tüm para birimlerini kontrol et
                        const allCurrencies = treatmentDetails.flatMap(detail => 
                          detail.toothPricing.map(tp => tp.currency)
                        );
                        const uniqueCurrencies = Array.from(new Set(allCurrencies));
                        
                        if (uniqueCurrencies.length > 1) {
                          // Farklı para birimleri varsa uyarı göster
                          return (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-yellow-800">Farklı Para Birimleri:</span>
                                <span className="text-sm text-yellow-700">
                                  {uniqueCurrencies.join(', ')}
                                </span>
                              </div>
                              <p className="text-xs text-yellow-600 mt-1">
                                Farklı para birimleri olduğu için genel toplam hesaplanamıyor.
                              </p>
                            </div>
                          );
                        } else if (uniqueCurrencies.length === 1) {
                          // Aynı para birimi varsa toplamı hesapla
                          const currency = uniqueCurrencies[0];
                          const total = treatmentDetails.reduce((sum, detail) => 
                            sum + detail.toothPricing.reduce((sum, tp) => sum + tp.totalPrice, 0), 0
                          );
                          
                          return (
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">Genel Toplam:</span>
                              <span className="text-xl font-bold text-green-600">
                                {parseFloat(total.toFixed(2))} {currency}
                              </span>
                            </div>
                          );
                        } else {
                          // Hiç fiyat yoksa
                          return (
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">Genel Toplam:</span>
                              <span className="text-gray-500">Fiyat girilmemiş</span>
                            </div>
                          );
                        }
                      })()}
                    </div>

                    {/* Özel Notlar */}
                    {patientInfo.specialNotes && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Özel Notlar</h5>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-blue-800">{patientInfo.specialNotes}</p>
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* PDF Şablon Seçimi */}
                  <Card className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">PDF Şablon Seçimi</h4>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pdfTemplates.map((tpl) => (
                          <div
                            key={tpl.id}
                            className={cn(
                              "border-2 border-gray-200 bg-white rounded-lg p-3 cursor-pointer hover:border-gray-300 transition-colors",
                              selectedTemplate === tpl.id && "border-blue-200 bg-blue-50"
                            )}
                            onClick={() => setSelectedTemplate(tpl.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded flex items-center justify-center",
                                selectedTemplate === tpl.id ? "bg-blue-500" : "bg-gray-500"
                              )}>
                                <FaFilePdf className="text-white text-sm" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{tpl.name}</div>
                                {tpl.description && <div className="text-xs text-gray-700">{tpl.description}</div>}
                                {tpl.isDefault && <div className="text-xs text-blue-600 font-medium">Varsayılan</div>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('/site/pdf-templates', '_blank')}
                        >
                          Şablonları Yönet
                        </Button>
                        <p className="text-xs text-gray-500">
                          Yeni bir şablon oluşturacaksanız, mevcut teklifi tekrar baştan oluşturmanız gerekebilir.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Doğrulama Bilgileri */}
                  <Card className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Hasta Erişim Doğrulaması</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Doğrulama Yöntemi
                        </label>
                        <Select
                          value={verificationMethod}
                          onValueChange={setVerificationMethod}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phone">Telefon Numarası (Son 4 hane)</SelectItem>
                            <SelectItem value="lastName">Soyad</SelectItem>
                            <SelectItem value="birthDate">Doğum Tarihi</SelectItem>
                            <SelectItem value="custom">Özel Şifre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Doğrulama Bilgisi
                        </label>
                        {verificationMethod === 'custom' ? (
                          <Input
                            value={verificationValue}
                            onChange={(e) => setVerificationValue(e.target.value)}
                            placeholder="Özel şifre girin"
                          />
                        ) : (
                          <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700">
                            {verificationValue || 'Hasta bilgileri girildikten sonra otomatik hesaplanacak'}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {verificationMethod === 'custom' 
                            ? 'Hasta bu özel şifreyi kullanarak teklife erişebilecek'
                            : 'Bu bilgi otomatik olarak hesaplanır ve hasta bu bilgiyi kullanarak teklife erişebilecek'
                          }
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Oluşturulan Link */}
                  {generatedLink && (
                    <Card className="p-6 bg-green-50 border-green-200">
                      <h4 className="font-semibold text-green-900 mb-4">Teklif Linki Oluşturuldu!</h4>
                      
                      <div className="space-y-3">
                        <div className="bg-white border border-green-300 rounded-lg p-3">
                          <p className="text-sm text-gray-600 mb-2">Hasta Erişim Linki:</p>
                          <div className="flex items-center gap-2">
                            <Input
                              value={generatedLink}
                              readOnly
                              className="flex-1"
                            />
                            <Button
                              onClick={handleCopyLink}
                              variant="outline"
                              size="sm"
                            >
                              Kopyala
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-green-700">
                          <p>✅ Teklif başarıyla oluşturuldu</p>
                          <p>✅ Hasta linki kopyalandı</p>
                          <p>✅ Doğrulama sistemi aktif</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Sağ Taraf: PDF Önizleme */}
                <div>
                  <Button
                    onClick={() => setShowPdfPreview(true)}
                    variant="outline"
                    className="w-full mb-4"
                  >
                    <FaFilePdf className="w-4 h-4 mr-2" />
                    PDF Önizleme
                  </Button>
                  
                  {showPdfPreview && (
                    <PDFPreview 
                      data={{
                        patient: {
                          firstName: patientInfo.firstName,
                          lastName: patientInfo.lastName,
                          phone: patientInfo.phone,
                          email: patientInfo.email,
                        },
                        clinic: {
                          name: "Diş Kliniği",
                          address: "Adres bilgisi",
                          phone: "Telefon bilgisi",
                          email: "Email bilgisi",
                          website: "Website bilgisi",
                        },
                        treatments: treatmentDetails.map(detail => ({
                          name: detail.treatmentName,
                          teeth: detail.selectedTeeth,
                          price: detail.toothPricing.reduce((sum, tp) => sum + tp.totalPrice, 0),
                          currency: detail.toothPricing[0]?.currency || 'TRY',
                          notes: detail.notes,
                          description: detail.notes,
                          duration: `${detail.estimatedDays || 1} gün`,
                          selectedTeeth: detail.selectedTeeth.join(', '),
                        })),
                        totalAmount: Math.round(treatmentDetails.reduce((sum, detail) => 
                          sum + detail.toothPricing.reduce((sum, tp) => sum + tp.totalPrice, 0), 0
                        ) * 100) / 100,
                        currency: treatmentDetails[0]?.toothPricing[0]?.currency || 'TRY',
                        vatRate: 20,
                        vatAmount: Math.round(treatmentDetails.reduce((sum, detail) => 
                          sum + detail.toothPricing.reduce((sum, tp) => sum + tp.vatAmount, 0), 0
                        ) * 100) / 100,
                        grandTotal: Math.round((treatmentDetails.reduce((sum, detail) => 
                          sum + detail.toothPricing.reduce((sum, tp) => sum + tp.totalPrice, 0), 0
                        ) * 1.2) * 100) / 100, // KDV dahil, 2 ondalık basamak
                        notes: patientInfo.specialNotes,
                        offerDate: new Date().toISOString().split('T')[0],
                        validUntil: validUntil,
                        doctor: "Dr. Uzman",
                        offerId: "preview",
                      }}
                      onClose={() => setShowPdfPreview(false)}
                    />
                  )}
                </div>
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex justify-between pt-6">
                <Button variant="secondary" onClick={handleBack} type="button" disabled={offerSent}>
                  Geri
                </Button>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={handleSaveOfferClick}
                    disabled={offerSent}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {offerSent ? (
                      'Teklif Gönderildi'
                    ) : (
                      'Taslak Olarak Kaydet'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleSendOfferClick} 
                    disabled={offerSent}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {offerSent ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Teklif Gönderildi
                      </>
                    ) : (
                      'Teklifi Gönder'
                    )}
                  </Button>
                </div>
              </div>

              {/* Bilgilendirme Notu */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Teklif Kaydetme Süreci:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• <strong>Taslak Olarak Kaydet:</strong> Teklifi taslak olarak kaydeder ve teklifler sayfasına yönlendirir</li>
                      <li>• <strong>Teklifi Gönder:</strong> Önce taslak olarak kaydeder, sonra aynı teklifi güncelleyerek gönderir</li>
                      <li>• Her iki durumda da sadece <strong>tek bir teklif</strong> oluşturulur</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Diğer adımlar burada benzer şekilde eklenebilir */}
        </CardContent>
      </Card>
    </PageContainer>
  );
} 