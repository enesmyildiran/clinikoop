# 📋 Teklif Modülü

Teklif modülü, Clinikoop platformunun ana işlevlerinden biridir. Diş kliniklerinin hasta tedavi tekliflerini oluşturmasını, PDF formatında sunmasını ve hasta ile paylaşmasını sağlar.

## 📋 Genel Bakış

Teklif modülü şu temel işlevleri yerine getirir:
- **Teklif Oluşturma** - Hasta için tedavi teklifi hazırlama
- **PDF Üretimi** - Profesyonel PDF teklifleri oluşturma
- **Link Paylaşımı** - Hasta ile güvenli link paylaşımı
- **Teklif Takibi** - Teklif durumlarını ve istatistiklerini takip etme
- **Tedavi Detayları** - Kapsamlı tedavi planları oluşturma

## 🎯 Özellikler

### ✅ Temel Özellikler
- **Multi-tenant Support** - Her klinik kendi tekliflerini yönetir
- **PDF Generation** - html2pdf.js ile profesyonel PDF'ler
- **Link-based Sharing** - Güvenli hasta erişimi
- **Treatment Planning** - Detaylı tedavi planları
- **Status Tracking** - Teklif durumu takibi
- **Currency Support** - Çoklu para birimi desteği

### 🔗 Entegrasyonlar
- **Hasta Modülü** - Hasta-teklif ilişkisi
- **Hatırlatma Modülü** - Teklif takibi hatırlatmaları
- **Raporlama Modülü** - Teklif analizleri
- **PDF Template Modülü** - Özelleştirilebilir şablonlar

## 🛠️ API Endpoint'leri

### 📥 GET /api/offers
**Açıklama**: Tüm teklifleri listeler

**Query Parameters**:
- `patientId` (opsiyonel): Belirli hasta ID'si
- `status` (opsiyonel): Teklif durumu

**Response**:
```json
{
  "success": true,
  "offers": [
    {
      "id": "offer_id",
      "title": "Ahmet Yılmaz - Tedavi Teklifi",
      "description": "Diş dolgusu, Diş temizliği",
      "totalPrice": 2500.00,
      "currency": "TRY",
      "slug": "offer-123456789",
      "validUntil": "2024-02-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "status": {
        "id": "status_id",
        "name": "accepted",
        "displayName": "Kabul Edildi",
        "color": "#10B981"
      },
      "patientOffers": [
        {
          "patient": {
            "id": "patient_id",
            "name": "Ahmet Yılmaz",
            "isActive": true
          }
        }
      ]
    }
  ]
}
```

### 📤 POST /api/offers
**Açıklama**: Yeni teklif oluşturur

**Request Body**:
```json
{
  "patientInfo": {
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "phone": "+905551234567",
    "email": "ahmet@email.com",
    "specialNotes": "Özel notlar"
  },
  "treatmentDetails": [
    {
      "treatmentKey": "filling",
      "treatmentName": "Diş Dolgusu",
      "selectedTeeth": [11, 12, 13],
      "toothPricing": [
        {
          "toothNumber": 11,
          "price": 500.00,
          "currency": "TRY",
          "vatRate": 20,
          "vatAmount": 100.00,
          "totalPrice": 600.00
        }
      ],
      "notes": "Kompozit dolgu",
      "estimatedDays": 1,
      "estimatedHours": 2
    }
  ],
  "socials": {
    "instagram": "@klinik",
    "facebook": "klinik.page",
    "whatsapp": "+905551234567"
  },
  "status": "draft",
  "selectedTemplate": "default",
  "verificationMethod": "phone",
  "verificationValue": "4567",
  "validUntil": "2024-02-01"
}
```

### 🔄 PUT /api/offers/[slug]
**Açıklama**: Teklif bilgilerini günceller

### 🗑️ DELETE /api/offers/[slug]
**Açıklama**: Teklifi siler

### 📄 GET /api/offers/[slug]
**Açıklama**: Teklif detayını getirir (hasta erişimi için)

## 🗄️ Database Modelleri

### Offer Model
```prisma
model Offer {
  id                String   @id @default(cuid())
  title             String
  description       String?
  totalPrice        Float
  currency          String   @default("TRY")
  validUntil        DateTime?
  isDeleted         Boolean  @default(false)
  slug              String   @unique
  pdfTemplateId     String?
  estimatedDuration Int?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  clinicId          String
  clinic            Clinic   @relation(fields: [clinicId], references: [id])
  
  createdById       String?
  createdBy         ClinicUser? @relation(fields: [createdById], references: [id])

  statusId          String?
  status            OfferStatus? @relation(fields: [statusId], references: [id])

  pdfTemplate       PDFTemplate? @relation(fields: [pdfTemplateId], references: [id])

  treatments        Treatment[]
  patientOffers     PatientOffer[]
  reminders         Reminder[]
  notes             Note[]

  @@map("offers")
}
```

### Treatment Model
```prisma
model Treatment {
  id                String   @id @default(cuid())
  name              String
  description       String?
  price             Float
  quantity          Int      @default(1)
  currency          String   @default("TRY")
  category          String   @default("general")
  key               String?
  selectedTeeth     String?
  estimatedDuration Int?
  order             Int      @default(0)
  isDeleted         Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  offerId           String
  offer             Offer    @relation(fields: [offerId], references: [id])

  @@map("treatments")
}
```

### OfferStatus Model
```prisma
model OfferStatus {
  id          String   @id @default(cuid())
  name        String   @unique
  displayName String
  color       String   @default("#6B7280")
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  isDefault   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  clinicId    String
  clinic      Clinic   @relation(fields: [clinicId], references: [id])

  offers      Offer[]

  @@map("offer_statuses")
}
```

## 🎨 UI Bileşenleri

### 📄 Sayfalar
- **`/site/offers`** - Teklif listesi
- **`/site/offers/new`** - Yeni teklif oluşturma
- **`/offer/[slug]`** - Hasta teklif görüntüleme sayfası

### 🔧 Bileşenler
- **OfferList** - Teklif listesi tablosu
- **OfferForm** - Teklif oluşturma formu
- **TreatmentSelector** - Tedavi seçimi bileşeni
- **PDFPreview** - PDF önizleme bileşeni
- **OfferStatusBadge** - Durum göstergesi

## 📝 Kullanım Örnekleri

### 1. Yeni Teklif Oluşturma
```typescript
const createOffer = async (offerData) => {
  const response = await fetch('/api/offers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offerData)
  });
  
  if (response.ok) {
    const { offer } = await response.json();
    return offer;
  }
  
  throw new Error('Teklif oluşturulamadı');
};
```

### 2. Teklif PDF'ini İndirme
```typescript
const downloadPDF = async (offerSlug) => {
  const response = await fetch(`/api/offers/${offerSlug}/pdf`);
  const blob = await response.blob();
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `teklif-${offerSlug}.pdf`;
  a.click();
};
```

### 3. Teklif Durumu Güncelleme
```typescript
const updateOfferStatus = async (offerSlug, statusId) => {
  const response = await fetch(`/api/offers/${offerSlug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ statusId })
  });
  
  return response.ok;
};
```

## 🔍 Kontrol Listeleri

### ✅ Geliştirme Kontrolü
- [ ] **Form Validasyonu** - Tüm zorunlu alanlar kontrol ediliyor
- [ ] **API Entegrasyonu** - Tüm endpoint'ler çalışıyor
- [ ] **ClinicId Filtresi** - Multi-tenant güvenlik sağlanıyor
- [ ] **PDF Generation** - PDF oluşturma çalışıyor
- [ ] **Link Generation** - Güvenli link oluşturma
- [ ] **Treatment Calculation** - Fiyat hesaplamaları doğru

### 🧪 Test Kontrolü
- [ ] **Teklif Oluşturma** - Yeni teklif başarıyla oluşturuluyor
- [ ] **PDF Generation** - PDF dosyası oluşturuluyor
- [ ] **Link Paylaşımı** - Hasta linki çalışıyor
- [ ] **Teklif Güncelleme** - Teklif bilgileri güncelleniyor
- [ ] **Durum Takibi** - Teklif durumları değişiyor
- [ ] **Responsive Design** - Mobil uyumluluk test edildi

### 🚀 Deployment Kontrolü
- [ ] **PDF Generation** - Production'da PDF oluşturma çalışıyor
- [ ] **File Storage** - PDF dosyaları güvenli saklanıyor
- [ ] **Link Security** - Hasta linkleri güvenli
- [ ] **Performance** - PDF oluşturma hızı kabul edilebilir
- [ ] **Error Handling** - Hata durumları yönetiliyor

## 🐛 Troubleshooting

### Yaygın Sorunlar

#### 1. Teklif Oluşturulamıyor
**Semptom**: POST /api/offers 400 hatası
**Çözüm**: 
- Form validasyonunu kontrol edin
- Hasta bilgilerinin doğru olduğundan emin olun
- Tedavi detaylarının eksiksiz olduğunu kontrol edin

#### 2. PDF Oluşturulamıyor
**Semptom**: PDF generation hatası
**Çözüm**:
- html2pdf.js kütüphanesinin yüklendiğinden emin olun
- DOM elementlerinin hazır olduğunu kontrol edin
- Browser compatibility'yi kontrol edin

#### 3. Hasta Linki Çalışmıyor
**Semptom**: /offer/[slug] 404 hatası
**Çözüm**:
- Slug'ın doğru oluşturulduğunu kontrol edin
- Teklifin aktif olduğundan emin olun
- ClinicId filtresini kontrol edin

#### 4. Fiyat Hesaplaması Yanlış
**Semptom**: Toplam fiyat yanlış hesaplanıyor
**Çözüm**:
- KDV hesaplamasını kontrol edin
- Para birimi dönüşümlerini kontrol edin
- Tedavi fiyatlarının doğru olduğundan emin olun

## 📈 Performans Optimizasyonları

### PDF Optimizasyonları
- **Lazy Loading**: PDF sadece gerektiğinde oluşturulur
- **Caching**: Oluşturulan PDF'ler cache'lenir
- **Compression**: PDF dosya boyutu optimize edilir

### Database Optimizasyonları
- **Index'ler**: `slug`, `clinicId`, `statusId` alanlarına index ekleyin
- **Selective Loading**: Sadece gerekli alanları yükleyin
- **Pagination**: Büyük teklif listeleri için pagination

### Frontend Optimizasyonları
- **React Query**: API cache'leme
- **Debounced Search**: Arama optimizasyonu
- **Virtual Scrolling**: Büyük listeler için

## 🔮 Gelecek Özellikler

- **E-signature** - Dijital imza desteği
- **Payment Integration** - Online ödeme entegrasyonu
- **SMS Notifications** - SMS ile teklif bildirimi
- **Template Editor** - Görsel şablon editörü
- **Multi-language** - Çoklu dil desteği
- **Analytics Dashboard** - Detaylı teklif analizleri

---

**Son Güncelleme**: 2024-01-XX
**Modül Versiyonu**: 1.0.0 