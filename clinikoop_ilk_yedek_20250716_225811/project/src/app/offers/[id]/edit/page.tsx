"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaFilePdf } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ToothSelector } from '@/components/ui/ToothSelector'
import { SocialMediaInputs } from '@/components/ui/SocialMediaInputs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { PDFPreview } from '@/components/ui/PDFPreview'

// Tedavi listesini import et
const TREATMENT_CATEGORIES = [
  { key: "aesthetic", label: "Estetik", treatments: [ { key: "zirconium-crown", name: "Zirconium Crown" }, { key: "laminate-veneer", name: "Laminate Veneer" }, { key: "e-max-crown", name: "E-Max Crown" }, { key: "teeth-whitening", name: "Teeth Whitening" }, { key: "smile-design", name: "Smile Design" }, { key: "hollywood-smile", name: "Hollywood Smile" }, ], },
  { key: "implant", label: "İmplant", treatments: [ { key: "dental-implant", name: "Dental Implant" }, { key: "all-on-4", name: "All-on-4 Implant Treatment" }, { key: "all-on-6", name: "All-on-6 Implant Treatment" }, { key: "sinus-lifting", name: "Sinus Lifting" }, { key: "bone-grafting", name: "Bone Grafting" }, { key: "temporary-crown", name: "Temporary Crown" }, { key: "full-mouth-rehab", name: "Full Mouth Rehabilitation" }, ], },
  { key: "surgical", label: "Cerrahi", treatments: [ { key: "tooth-extraction", name: "Tooth Extraction" }, { key: "surgical-tooth-extraction", name: "Surgical Tooth Extraction" }, { key: "wisdom-tooth-extraction", name: "Wisdom Tooth Extraction" }, ], },
  { key: "restorative", label: "Restoratif", treatments: [ { key: "composite-filling", name: "Composite Filling" }, { key: "inlay-onlay-filling", name: "Inlay / Onlay Filling" }, { key: "dental-bridge", name: "Dental Bridge" }, { key: "root-canal-treatment", name: "Root Canal Treatment" }, ], },
  { key: "prosthetics", label: "Protez", treatments: [ { key: "removable-denture", name: "Removable Denture" }, { key: "fixed-denture", name: "Fixed Denture" }, ], },
  { key: "orthodontics", label: "Ortodonti", treatments: [ { key: "orthodontic-treatment", name: "Orthodontic Treatment (Braces)" }, { key: "clear-aligner", name: "Clear Aligner (Invisalign)" }, ], },
  { key: "general", label: "Genel & Diğer", treatments: [ { key: "periodontal-treatment", name: "Periodontal Treatment" }, { key: "night-guard", name: "Night Guard" }, { key: "pediatric-dental-treatment", name: "Pediatric Dental Treatment" }, ], },
];
const allTreatments = TREATMENT_CATEGORIES.flatMap(cat => cat.treatments.map(t => ({ ...t, category: cat.key, categoryLabel: cat.label })));
const CURRENCIES = [ { value: "TRY", label: "TRY (₺)" }, { value: "USD", label: "USD ($)" }, { value: "EUR", label: "EUR (€)" }, ];

export default function OfferEditPage() {
  const params = useParams()
  const router = useRouter()
  const offerId = params?.id as string
  const [offer, setOffer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>(null)
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([])
  const [estimatedDays, setEstimatedDays] = useState<number>(0)
  const [estimatedHours, setEstimatedHours] = useState<number>(0)
  const [socialMedia, setSocialMedia] = useState<Record<string, string>>({})
  const [treatments, setTreatments] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [statuses, setStatuses] = useState<any[]>([])
  const [selectedStatusId, setSelectedStatusId] = useState<string>('')

  useEffect(() => {
    if (!offerId) return
    fetchOffer()
    fetchStatuses()
  }, [offerId])

  const fetchOffer = async () => {
    setLoading(true)
    let res = await fetch(`/api/offers?id=${offerId}`)
    let data = await res.json()
    if (!data.offer) {
      // id ile bulunamazsa slug ile dene
      res = await fetch(`/api/offers/${offerId}`)
      data = await res.json()
    }
    setOffer(data.offer || null)
    setForm(data.offer || null)
    setSelectedTeeth(data.offer?.teeth || [])
    setEstimatedDays(data.offer?.estimatedDays || 0)
    setEstimatedHours(data.offer?.estimatedHours || 0)
    setSocialMedia(data.offer?.socialMedia || {})
    setTreatments(data.offer?.treatments || [])
    setSelectedStatusId(data.offer?.statusId || '')
    setLoading(false)
  }

  const fetchStatuses = async () => {
    try {
      const res = await fetch('/api/offer-statuses')
      const data = await res.json()
      if (data.success) {
        setStatuses(data.statuses)
      }
    } catch (error) {
      console.error('Durumlar yüklenirken hata:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  // Tedavi güncelle
  const handleTreatmentChange = (idx: number, field: string, value: any) => {
    setTreatments(prev => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t))
    
    // Eğer fiyat, miktar veya para birimi değiştiyse toplam fiyatı güncelle
    if (field === 'price' || field === 'quantity' || field === 'currency') {
      const updatedTreatments = treatments.map((t, i) => i === idx ? { ...t, [field]: value } : t);
      const totalAmount = updatedTreatments.reduce((sum, t) => {
        const price = typeof t.price === 'number' ? t.price : 0;
        const quantity = typeof t.quantity === 'number' ? t.quantity : 1;
        return sum + (price * quantity);
      }, 0);
      
      setForm((prev: any) => ({ ...prev, totalPrice: totalAmount }));
    }
  }

  // Toplam fiyat hesaplama fonksiyonu
  const calculateTotalPrice = () => {
    return treatments.reduce((sum, t) => {
      const price = typeof t.price === 'number' ? t.price : 0;
      const quantity = typeof t.quantity === 'number' ? t.quantity : 1;
      return sum + (price * quantity);
    }, 0);
  };

  // Tedavi ekle
  const handleAddTreatment = () => {
    setTreatments(prev => [
      ...prev,
      { name: '', description: '', price: 0, quantity: 1, selectedTeeth: [], currency: 'TRY' }
    ])
  }

  // Tedavi sil
  const handleDeleteTreatment = (idx: number) => {
    setTreatments(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Yeni API formatına uygun veri hazırla
    const updated = {
      title: form.title,
      description: form.description,
      totalPrice: form.totalPrice,
      status: form.status || 'DRAFT',
      offerStatusId: selectedStatusId,
      estimatedDays,
      estimatedHours,
      treatments: treatments.map(t => ({
        name: t.name,
        description: t.description || '',
        price: typeof t.price === 'number' ? t.price : 0,
        quantity: typeof t.quantity === 'number' ? t.quantity : 1,
        selectedTeeth: t.selectedTeeth || [],
      })),
      socialMedia,
    }
    
    console.log('Gönderilen veri:', updated)
    
    const res = await fetch(`/api/offers/${offer.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    
    const result = await res.json()
    
    if (res.ok && result.success) {
      alert('Teklif başarıyla güncellendi!')
      router.push('/offers')
    } else {
      console.error('Kaydetme hatası:', result)
      alert(`Kaydetme başarısız: ${result.error || 'Bilinmeyen hata'}`)
    }
  }

  const handleSaveAndShowPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Kaydetme işlemi
    const updated = {
      title: form.title,
      description: form.description,
      totalPrice: form.totalPrice,
      status: form.status || 'DRAFT',
      offerStatusId: selectedStatusId,
      estimatedDays,
      estimatedHours,
      treatments: treatments.map(t => ({
        name: t.name,
        description: t.description || '',
        price: typeof t.price === 'number' ? t.price : 0,
        quantity: typeof t.quantity === 'number' ? t.quantity : 1,
        selectedTeeth: t.selectedTeeth || [],
        key: t.key,
        category: t.category,
        currency: t.currency || 'TRY',
      })),
      socialMedia,
    };
    const res = await fetch(`/api/offers/${offer.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setIsSaving(false);
    if (res.ok) {
      window.open(`/offer/${offer.slug}`, '_blank');
    } else {
      alert('Kaydetme başarısız!');
    }
  };

  // PDF verisi oluştur
  const createPdfData = () => {
    if (!offer || !offer.patient) return null;
    
    const totalAmount = treatments.reduce((sum, t) => sum + (t.price * t.quantity), 0);
    const vatRate = 18; // %18 KDV
    const vatAmount = totalAmount * (vatRate / 100);
    const grandTotal = totalAmount + vatAmount;
    
    return {
      patient: {
        firstName: offer.patient.name?.split(' ')[0] || '',
        lastName: offer.patient.name?.split(' ').slice(1).join(' ') || '',
        phone: offer.patient.phone || '',
        email: offer.patient.email || '',
      },
      treatments: treatments.map(t => ({
        name: t.name || 'Tedavi',
        teeth: t.selectedTeeth || [],
        price: t.price || 0,
        currency: t.currency || 'TRY',
        notes: t.description || '',
      })),
      totalAmount,
      currency: 'TRY',
      vatRate,
      vatAmount,
      grandTotal,
      notes: form.description || '',
      offerDate: new Date().toLocaleDateString('tr-TR'),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'), // 30 gün sonra
    };
  };

  if (loading) return <div className="text-center py-12">Yükleniyor...</div>
  if (!offer) return <div className="text-center py-12 text-red-500">Teklif bulunamadı.</div>

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={() => router.back()} variant="outline" size="sm">
          <FaArrowLeft className="mr-2" /> Geri
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Teklif Düzenle</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        {/* Hasta Bilgileri (readonly) */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Hasta Bilgileri</h3>
          <Input label="Hasta Adı" value={offer.patient?.name || ''} readOnly disabled />
          <Input label="Telefon" value={offer.patient?.phone || ''} readOnly disabled />
          <Input label="E-posta" value={offer.patient?.email || ''} readOnly disabled />
        </div>
        
        {/* Pipeline Durumu */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Pipeline Durumu</h3>
          <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
            <Select value={selectedStatusId} onValueChange={setSelectedStatusId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Durum seçin..." />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status.id} value={status.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: status.color }}
                      />
                      {status.displayName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tedavi ve Fiyat Alanları (düzenlenebilir) */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Tedavi ve Fiyat</h3>
          <Input label="Başlık" value={form.title || ''} onChange={e => handleInputChange('title', e.target.value)} />
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <Textarea value={form.description || ''} onChange={e => handleInputChange('description', e.target.value)} />
          <Input 
            label="Toplam Tutar (Otomatik Hesaplanır)" 
            type="number" 
            value={calculateTotalPrice()} 
            readOnly 
            disabled 
            className="bg-gray-50"
          />
        </div>
        {/* Diş Seçimi */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Diş Seçimi</h3>
          <ToothSelector selectedTeeth={selectedTeeth} onTeethChange={setSelectedTeeth} />
        </div>
        {/* Tahmini Süre */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Tahmini Süre</h3>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gün</label>
              <Input type="number" min={0} value={estimatedDays} onChange={e => setEstimatedDays(Number(e.target.value))} className="w-24" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
              <Input type="number" min={0} max={23} value={estimatedHours} onChange={e => setEstimatedHours(Number(e.target.value))} className="w-24" />
            </div>
            <span className="text-xs text-gray-500 mb-2">Örnek: 2 gün 3 saat</span>
          </div>
        </div>
        {/* Sosyal Medya */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Sosyal Medya</h3>
          <SocialMediaInputs value={socialMedia} onChange={setSocialMedia} />
        </div>
        {/* Tedavi Listesi */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">Tedaviler
            <button type="button" onClick={handleAddTreatment} className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1"><FaPlus /> Tedavi Ekle</button>
          </h3>
          {treatments.length === 0 && <div className="text-gray-400 text-sm">Henüz tedavi eklenmedi.</div>}
          <div className="space-y-4">
            {treatments.map((t, idx) => {
              // Kategori ve tedavi key'ini state'te tut
              const selectedCategory = t.category || '';
              const categoryTreatments = selectedCategory ? TREATMENT_CATEGORIES.find(cat => cat.key === selectedCategory)?.treatments || [] : [];
              return (
                <div key={idx} className="flex flex-col gap-2 bg-gray-50 rounded-lg p-3 border">
                  <div className="flex flex-col md:flex-row gap-2 items-end">
                    <div className="w-48">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
                      <Select value={selectedCategory} onValueChange={val => handleTreatmentChange(idx, 'category', val)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Kategori seçin..." />
                        </SelectTrigger>
                        <SelectContent>
                          {TREATMENT_CATEGORIES.map(cat => (
                            <SelectItem key={cat.key} value={cat.key}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tedavi</label>
                      <Select value={t.key || ''} onValueChange={val => handleTreatmentChange(idx, 'key', val)} disabled={!selectedCategory}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tedavi seçin..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryTreatments.map(tr => (
                            <SelectItem key={tr.key} value={tr.key}>{tr.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Input label="Açıklama" value={t.description} onChange={e => handleTreatmentChange(idx, 'description', e.target.value)} />
                    </div>
                    <div className="w-32">
                      <Input label="Fiyat" type="number" value={t.price} onChange={e => handleTreatmentChange(idx, 'price', Number(e.target.value))} min={0} />
                    </div>
                    <div className="w-24">
                      <Input label="Adet" type="number" value={t.quantity} onChange={e => handleTreatmentChange(idx, 'quantity', Number(e.target.value))} min={1} />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Para Birimi</label>
                      <Select value={t.currency || 'TRY'} onValueChange={val => handleTreatmentChange(idx, 'currency', val)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Para birimi seçin..." />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map(cur => (
                            <SelectItem key={cur.value} value={cur.value}>{cur.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <button type="button" onClick={() => handleDeleteTreatment(idx)} className="text-red-600 hover:text-red-800 ml-2" title="Sil"><FaTrash /></button>
                  </div>
                  {/* Her tedavi için diş seçimi */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Diş Seçimi</label>
                    <ToothSelector selectedTeeth={t.selectedTeeth || []} onTeethChange={teeth => handleTreatmentChange(idx, 'selectedTeeth', teeth)} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <Button type="button" onClick={() => router.back()} variant="outline">İptal</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" disabled={isSaving}>
            <FaSave className="w-4 h-4" /> Kaydet
          </Button>
          <Button type="button" onClick={handleSaveAndShowPdf} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2" disabled={isSaving}>
            <FaSave className="w-4 h-4" /> Kaydet ve PDF Göster
          </Button>
          <Button 
            type="button" 
            onClick={() => setShowPdfPreview(!showPdfPreview)} 
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <FaFilePdf className="w-4 h-4" /> PDF Önizle
          </Button>
        </div>
      </form>
      
      {/* PDF Önizleme */}
      {showPdfPreview && createPdfData() && (
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">PDF Önizleme</h3>
              <Button 
                onClick={() => setShowPdfPreview(false)}
                variant="outline"
                size="sm"
              >
                Kapat
              </Button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Clinikoop Diş Klinikleri</h2>
                <p className="text-gray-600">Tedavi Teklifi</p>
              </div>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Hasta Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ad Soyad:</span>
                      <span className="ml-2 font-medium">{createPdfData()?.patient.firstName} {createPdfData()?.patient.lastName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Telefon:</span>
                      <span className="ml-2 font-medium">{createPdfData()?.patient.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">E-posta:</span>
                      <span className="ml-2 font-medium">{createPdfData()?.patient.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tarih:</span>
                      <span className="ml-2 font-medium">{createPdfData()?.offerDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Tedaviler</h4>
                  <div className="space-y-2">
                    {createPdfData()?.treatments.map((treatment, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <span className="font-medium">{treatment.name}</span>
                          {treatment.teeth.length > 0 && (
                            <span className="text-sm text-gray-600 ml-2">
                              (Diş: {treatment.teeth.join(', ')})
                            </span>
                          )}
                        </div>
                        <span className="font-semibold">
                          {treatment.price.toLocaleString('tr-TR')} {treatment.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ara Toplam:</span>
                    <span className="font-semibold">{createPdfData()?.totalAmount.toLocaleString('tr-TR')} {createPdfData()?.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">KDV (%{createPdfData()?.vatRate}):</span>
                    <span className="font-semibold">{createPdfData()?.vatAmount.toLocaleString('tr-TR')} {createPdfData()?.currency}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Toplam:</span>
                    <span>{createPdfData()?.grandTotal.toLocaleString('tr-TR')} {createPdfData()?.currency}</span>
                  </div>
                </div>
                
                {createPdfData()?.notes && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Notlar</h4>
                    <p className="text-sm text-gray-700">{createPdfData()?.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="text-center mt-6 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Bu teklif {createPdfData()?.validUntil} tarihine kadar geçerlidir.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 