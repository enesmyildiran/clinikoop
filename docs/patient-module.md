# 🏥 Hasta Modülü

Hasta modülü, Clinikoop platformunun temel bileşenlerinden biridir. Diş kliniklerinin hasta kayıtlarını yönetmesini, hasta bilgilerini takip etmesini ve hasta-kliniği arasındaki iletişimi kolaylaştırmasını sağlar.

## 📋 Genel Bakış

Hasta modülü şu temel işlevleri yerine getirir:
- **Hasta Kayıt** - Yeni hasta oluşturma ve kayıt
- **Hasta Listesi** - Tüm hastaları görüntüleme ve filtreleme
- **Hasta Detayı** - Hasta bilgilerini düzenleme ve görüntüleme
- **Hasta Takibi** - Hasta aktivitelerini ve tekliflerini takip etme
- **Hatırlatmalar** - Hasta ile ilgili hatırlatmalar oluşturma

## 🎯 Özellikler

### ✅ Temel Özellikler
- **Multi-tenant Support** - Her klinik kendi hastalarını yönetir
- **Kapsamlı Hasta Bilgileri** - Kişisel, tıbbi ve iletişim bilgileri
- **Referral Source Tracking** - Hasta kaynaklarını takip etme
- **Arama ve Filtreleme** - Gelişmiş arama ve filtreleme özellikleri
- **Responsive Design** - Tüm cihazlarda uyumlu tasarım

### 🔗 Entegrasyonlar
- **Teklif Modülü** - Hasta-teklif ilişkisi
- **Hatırlatma Modülü** - Hasta hatırlatmaları
- **Raporlama Modülü** - Hasta analizleri
- **Destek Modülü** - Hasta destek talepleri

## 🛠️ API Endpoint'leri

### 📥 GET /api/patients
**Açıklama**: Tüm hastaları listeler veya tek hasta getirir

**Query Parameters**:
- `id` (opsiyonel): Belirli bir hasta ID'si

**Response**:
```json
{
  "patients": [
    {
      "id": "clinic_id",
      "name": "Ahmet Yılmaz",
      "email": "ahmet@email.com",
      "phone": "+905551234567",
      "birthDate": "1990-01-01T00:00:00.000Z",
      "gender": "MALE",
      "referralSource": {
        "id": "source_id",
        "name": "google",
        "displayName": "Google Arama",
        "color": "#3B82F6"
      },
      "createdBy": {
        "id": "user_id",
        "name": "Admin User",
        "email": "admin@clinikoop.com"
      },
      "offers": [
        {
          "id": "offer_id",
          "title": "Tedavi Teklifi",
          "status": {
            "name": "accepted",
            "displayName": "Kabul Edildi",
            "color": "#10B981"
          }
        }
      ]
    }
  ]
}
```

### 📤 POST /api/patients
**Açıklama**: Yeni hasta oluşturur

**Request Body**:
```json
{
  "name": "Ahmet Yılmaz",
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@email.com",
  "phone": "+905551234567",
  "phoneCountry": "TR",
  "birthDate": "1990-01-01",
  "gender": "MALE",
  "nationality": "TR",
  "country": "TR",
  "address": "İstanbul, Türkiye",
  "city": "İstanbul",
  "emergencyContact": "Anne Yılmaz",
  "emergencyPhone": "+905559876543",
  "instagram": "@ahmetyilmaz",
  "facebook": "ahmet.yilmaz",
  "whatsapp": "+905551234567",
  "referralSourceId": "source_id",
  "medicalHistory": "Alerji: Penisilin",
  "allergies": "Penisilin",
  "insurance": "SGK",
  "insuranceNumber": "12345678901",
  "notes": "Özel notlar"
}
```

### 🔄 PUT /api/patients?id={id}
**Açıklama**: Hasta bilgilerini günceller

### 🗑️ DELETE /api/patients?id={id}
**Açıklama**: Hastayı pasif hale getirir (soft delete)

### 🔍 GET /api/patients/by-source
**Açıklama**: Hasta filtreleme API'si

**Query Parameters**:
- `referralSourceId`: Referral source ID'si
- `search`: Arama terimi
- `status`: Aktif/pasif durumu

### 📊 GET /api/patients/counts-by-source
**Açıklama**: Hasta sayılarını referral source'a göre gruplandırır

**Response**:
```json
{
  "success": true,
  "data": {
    "bySource": [
      {
        "sourceId": "source_id",
        "sourceName": "Google Arama",
        "sourceColor": "#3B82F6",
        "patientCount": 25
      }
    ],
    "total": 100,
    "active": 85,
    "inactive": 15
  }
}
```

## 🗄️ Database Modelleri

### Patient Model
```prisma
model Patient {
  id                String   @id @default(cuid())
  name              String
  email             String?
  phone             String?
  birthDate         DateTime?
  gender            String?
  address           String?
  city              String?
  country           String   @default("TR")
  nationality       String   @default("TR")
  phoneCountry      String   @default("+90")
  notes             String?
  isActive          Boolean  @default(true)
  isDeleted         Boolean  @default(false)
  referralSourceId  String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  medicalHistory    String?
  allergies         String?
  medications       String?
  emergencyContact  String?

  clinicId          String
  clinic            Clinic   @relation(fields: [clinicId], references: [id])
  
  createdById       String?
  createdBy         ClinicUser? @relation(fields: [createdById], references: [id])

  offers            PatientOffer[]
  reminders         Reminder[]

  referralSource    ReferralSource? @relation(fields: [referralSourceId], references: [id])

  @@map("patients")
}
```

### PatientOffer Model
```prisma
model PatientOffer {
  id        String   @id @default(cuid())
  patientId String
  offerId   String
  clinicId  String
  assigned  Boolean  @default(false)
  visible   Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  patient   Patient  @relation(fields: [patientId], references: [id])
  offer     Offer    @relation(fields: [offerId], references: [id])
  clinic    Clinic   @relation(fields: [clinicId], references: [id])

  @@unique([patientId, offerId])
  @@map("patient_offers")
}
```

## 🎨 UI Bileşenleri

### 📄 Sayfalar
- **`/site/patients`** - Hasta listesi
- **`/site/patients/new`** - Yeni hasta oluşturma
- **`/site/patients/[id]`** - Hasta detayı

### 🔧 Bileşenler
- **PatientList** - Hasta listesi tablosu
- **PatientForm** - Hasta kayıt/düzenleme formu
- **PatientDetail** - Hasta detay görünümü
- **PatientFilters** - Hasta filtreleme bileşeni

## 📝 Kullanım Örnekleri

### 1. Yeni Hasta Oluşturma
```typescript
const createPatient = async (patientData) => {
  const response = await fetch('/api/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });
  
  if (response.ok) {
    const { patient } = await response.json();
    return patient;
  }
  
  throw new Error('Hasta oluşturulamadı');
};
```

### 2. Hasta Arama
```typescript
const searchPatients = async (query) => {
  const response = await fetch(`/api/patients/by-source?search=${query}`);
  const { patients } = await response.json();
  return patients;
};
```

### 3. Hasta İstatistikleri
```typescript
const getPatientStats = async () => {
  const response = await fetch('/api/patients/counts-by-source');
  const { data } = await response.json();
  return data;
};
```

## 🔍 Kontrol Listeleri

### ✅ Geliştirme Kontrolü
- [ ] **Form Validasyonu** - Tüm zorunlu alanlar kontrol ediliyor
- [ ] **API Entegrasyonu** - Tüm endpoint'ler çalışıyor
- [ ] **ClinicId Filtresi** - Multi-tenant güvenlik sağlanıyor
- [ ] **Duplicate Kontrol** - Telefon/email benzersizlik kontrolü
- [ ] **Error Handling** - Hata durumları yönetiliyor
- [ ] **Loading States** - Yükleme durumları gösteriliyor

### 🧪 Test Kontrolü
- [ ] **Hasta Oluşturma** - Yeni hasta başarıyla oluşturuluyor
- [ ] **Hasta Listesi** - Tüm hastalar görüntüleniyor
- [ ] **Hasta Arama** - Arama fonksiyonu çalışıyor
- [ ] **Hasta Filtreleme** - Referral source filtresi çalışıyor
- [ ] **Hasta Düzenleme** - Hasta bilgileri güncelleniyor
- [ ] **Hasta Silme** - Soft delete çalışıyor
- [ ] **Responsive Design** - Mobil uyumluluk test edildi

### 🚀 Deployment Kontrolü
- [ ] **Database Migration** - PatientOffer clinicId migration'ı çalıştırıldı
- [ ] **API Routes** - Tüm endpoint'ler production'da çalışıyor
- [ ] **Environment Variables** - Gerekli env vars ayarlandı
- [ ] **Performance** - Sayfa yükleme hızları kabul edilebilir
- [ ] **Security** - Multi-tenant isolation test edildi

## 🐛 Troubleshooting

### Yaygın Sorunlar

#### 1. Hasta Oluşturulamıyor
**Semptom**: POST /api/patients 400 hatası
**Çözüm**: 
- Form validasyonunu kontrol edin
- ClinicId'nin doğru gönderildiğinden emin olun
- Duplicate telefon/email kontrolü yapın

#### 2. Hasta Listesi Boş Görünüyor
**Semptom**: GET /api/patients boş array döndürüyor
**Çözüm**:
- ClinicId'nin doğru alındığını kontrol edin
- Database'de hasta verisi olduğundan emin olun
- isActive filtresini kontrol edin

#### 3. Hasta Detayı Yüklenmiyor
**Semptom**: GET /api/patients?id= 404 hatası
**Çözüm**:
- Hasta ID'sinin doğru olduğunu kontrol edin
- ClinicId filtresinin çalıştığını doğrulayın
- Database'de hasta kaydının var olduğunu kontrol edin

#### 4. PatientOffer İlişkisi Çalışmıyor
**Semptom**: Hasta detayında teklifler görünmüyor
**Çözüm**:
- PatientOffer tablosunda clinicId alanının eklendiğinden emin olun
- Migration'ları çalıştırın
- API'de include ilişkilerini kontrol edin

## 📈 Performans Optimizasyonları

### Database Optimizasyonları
- **Index'ler**: `clinicId`, `phone`, `email` alanlarına index ekleyin
- **Pagination**: Büyük hasta listeleri için pagination kullanın
- **Selective Loading**: Sadece gerekli alanları yükleyin

### Frontend Optimizasyonları
- **React Query**: API cache'leme için React Query kullanın
- **Lazy Loading**: Büyük listeler için virtual scrolling
- **Debounced Search**: Arama için debounce kullanın

## 🔮 Gelecek Özellikler

- **Hasta Fotoğrafı** - Hasta profil fotoğrafı ekleme
- **Hasta Geçmişi** - Detaylı hasta geçmişi takibi
- **Hasta Kategorileri** - Hasta segmentasyonu
- **Otomatik Hatırlatmalar** - Akıllı hatırlatma sistemi
- **Hasta Portalı** - Hasta self-service portalı

---

**Son Güncelleme**: 2024-01-XX
**Modül Versiyonu**: 1.0.0 