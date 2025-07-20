# 📚 API Dokümantasyonu

Bu dokümantasyon, Clinikoop platformunun tüm API endpoint'lerini ve kullanım örneklerini içerir.

## 📋 İçindekiler

- [Genel Bilgiler](#genel-bilgiler)
- [Authentication](#authentication)
- [Multi-tenant Architecture](#multi-tenant-architecture)
- [API Endpoint'leri](#api-endpointleri)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## 🌐 Genel Bilgiler

### Base URL
```
Production: https://your-domain.vercel.app
Development: http://localhost:3000
```

### Content Type
```
Content-Type: application/json
```

### Response Format
Tüm API yanıtları aşağıdaki formatı takip eder:

```json
{
  "success": true,
  "data": { ... },
  "message": "İşlem başarılı"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Hata mesajı",
  "details": { ... }
}
```

## 🔐 Authentication

### NextAuth.js Session
Çoğu API endpoint'i NextAuth.js session gerektirir:

```typescript
// Session kontrolü
const session = await getServerSession(authOptions);
if (!session?.user) {
  return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
}
```

### Patient Access (Public)
Hasta teklif görüntüleme endpoint'leri public erişime açıktır:
- `GET /api/offers/[slug]` - Teklif detayı
- `GET /offer/[slug]` - Teklif sayfası

## 🏢 Multi-tenant Architecture

Tüm API endpoint'leri multi-tenant yapıda çalışır. Her istek otomatik olarak clinicId ile filtrelenir:

```typescript
// ClinicId otomatik olarak alınır
const clinicId = await getClinicIdFromRequest(request);
if (!clinicId) {
  return NextResponse.json({ error: 'Klinik bilgisi bulunamadı' }, { status: 400 });
}
```

## 🛠️ API Endpoint'leri

### 🏥 Hasta Modülü

#### GET /api/patients
**Açıklama**: Hastaları listeler veya tek hasta getirir

**Query Parameters**:
- `id` (opsiyonel): Belirli bir hasta ID'si

**Response**:
```json
{
  "patients": [
    {
      "id": "patient_id",
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
      }
    }
  ]
}
```

#### POST /api/patients
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

#### PUT /api/patients?id={id}
**Açıklama**: Hasta bilgilerini günceller

#### DELETE /api/patients?id={id}
**Açıklama**: Hastayı pasif hale getirir (soft delete)

#### GET /api/patients/by-source
**Açıklama**: Hasta filtreleme API'si

**Query Parameters**:
- `referralSourceId`: Referral source ID'si
- `search`: Arama terimi
- `status`: Aktif/pasif durumu

#### GET /api/patients/counts-by-source
**Açıklama**: Hasta sayılarını referral source'a göre gruplandırır

### 📋 Teklif Modülü

#### GET /api/offers
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

#### POST /api/offers
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

#### GET /api/offers/[slug]
**Açıklama**: Teklif detayını getirir (hasta erişimi için)

#### PUT /api/offers/[slug]
**Açıklama**: Teklif bilgilerini günceller

#### DELETE /api/offers/[slug]
**Açıklama**: Teklifi siler

### 🔔 Hatırlatma Modülü

#### GET /api/reminders
**Açıklama**: Hatırlatmaları listeler

**Query Parameters**:
- `patientId` (opsiyonel): Belirli hasta ID'si
- `isCompleted` (opsiyonel): Tamamlanma durumu
- `isPinned` (opsiyonel): Sabitlenme durumu

#### POST /api/reminders
**Açıklama**: Yeni hatırlatma oluşturur

**Request Body**:
```json
{
  "title": "Kontrol randevusu",
  "description": "Hasta kontrol randevusu",
  "dueDate": "2024-02-01T10:00:00.000Z",
  "patientId": "patient_id",
  "isPinned": false
}
```

#### PUT /api/reminders/[id]
**Açıklama**: Hatırlatma günceller

#### DELETE /api/reminders/[id]
**Açıklama**: Hatırlatma siler

### 📊 Raporlama Modülü

#### POST /api/reports
**Açıklama**: Detaylı rapor oluşturur

**Request Body**:
```json
{
  "dateFrom": "2024-01-01",
  "dateTo": "2024-01-31",
  "currency": "TRY",
  "salesUserId": "user_id",
  "treatmentType": "filling",
  "referralSourceId": "source_id",
  "page": 1,
  "pageSize": 20
}
```

**Response**:
```json
{
  "success": true,
  "offers": [...],
  "summary": {
    "totalOffers": 150,
    "totalSales": 45000.00,
    "conversionRate": 75.5
  },
  "targetCurrency": "TRY"
}
```

### 📈 Performans Modülü

#### POST /api/performance
**Açıklama**: Performans metriklerini getirir

**Request Body**:
```json
{
  "timeRange": "month",
  "targetCurrency": "TRY"
}
```

**Response**:
```json
{
  "success": true,
  "totalRevenue": 45000.00,
  "totalPatients": 120,
  "totalOffers": 150,
  "successRate": 75.5,
  "monthlyData": [
    {
      "month": "Ocak",
      "revenue": 15000.00,
      "patients": 40,
      "offers": 50,
      "successRate": 80.0
    }
  ],
  "currencyDistribution": [
    {
      "currency": "TRY",
      "amount": 45000.00,
      "percentage": 100.0
    }
  ],
  "targetCurrency": "TRY"
}
```

### 🎯 Destek Modülü

#### GET /api/support/tickets
**Açıklama**: Destek taleplerini listeler

**Query Parameters**:
- `status`: Durum filtresi
- `category`: Kategori filtresi
- `priority`: Öncelik filtresi

#### POST /api/support/tickets
**Açıklama**: Yeni destek talebi oluşturur

**Request Body**:
```json
{
  "subject": "Teknik sorun",
  "description": "Sistem yavaş çalışıyor",
  "categoryId": "category_id",
  "priorityId": "priority_id",
  "isUrgent": false
}
```

#### GET /api/support/tickets/[id]
**Açıklama**: Destek talebi detayını getirir

#### PATCH /api/support/tickets/[id]
**Açıklama**: Destek talebi günceller

#### POST /api/support/tickets/[id]/messages
**Açıklama**: Destek talebine mesaj gönderir

**Request Body**:
```json
{
  "content": "Mesaj içeriği",
  "authorName": "Kullanıcı Adı",
  "authorType": "CLINIC_USER"
}
```

### 🔧 Admin Modülü

#### GET /api/admin/analytics
**Açıklama**: Admin analitik verilerini getirir

**Request Body**:
```json
{
  "clinicId": "clinic_id",
  "dataTypes": ["clinicStats", "userActivity"],
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "pageSize": 10
}
```

#### GET /api/admin/clinics
**Açıklama**: Tüm klinikleri listeler

#### GET /api/admin/users
**Açıklama**: Tüm kullanıcıları listeler

#### GET /api/admin/logs
**Açıklama**: Sistem loglarını getirir

### 📄 PDF Template Modülü

#### GET /api/pdf-templates
**Açıklama**: PDF şablonlarını listeler

**Query Parameters**:
- `id` (opsiyonel): Belirli şablon ID'si

#### POST /api/pdf-templates
**Açıklama**: Yeni PDF şablonu oluşturur

**Request Body**:
```json
{
  "name": "Varsayılan Şablon",
  "description": "Standart teklif şablonu",
  "content": "<html>...</html>",
  "isDefault": true
}
```

#### PUT /api/pdf-templates/[id]
**Açıklama**: PDF şablonu günceller

#### DELETE /api/pdf-templates/[id]
**Açıklama**: PDF şablonu siler

### 🔗 Referral Sources

#### GET /api/referral-sources
**Açıklama**: Referral source'ları listeler

#### POST /api/referral-sources
**Açıklama**: Yeni referral source oluşturur

#### PUT /api/referral-sources/[id]
**Açıklama**: Referral source günceller

#### DELETE /api/referral-sources/[id]
**Açıklama**: Referral source siler

### ⚙️ Ayarlar

#### GET /api/settings
**Açıklama**: Sistem ayarlarını getirir

#### POST /api/settings
**Açıklama**: Sistem ayarlarını günceller

### 📊 Metrikler

#### GET /api/metrics
**Açıklama**: Prometheus formatında metrikleri getirir

#### GET /api/metrics/api
**Açıklama**: API metriklerini getirir

#### GET /api/metrics/business
**Açıklama**: İş metriklerini getirir

#### GET /api/metrics/database
**Açıklama**: Database metriklerini getirir

### 🔐 Authentication

#### POST /api/auth/login
**Açıklama**: Kullanıcı girişi

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
**Açıklama**: Mevcut kullanıcı bilgilerini getirir

#### POST /api/auth/logout
**Açıklama**: Kullanıcı çıkışı

### 👤 Kullanıcı Profili

#### GET /api/users/profile
**Açıklama**: Kullanıcı profilini getirir

#### PUT /api/users/profile
**Açıklama**: Kullanıcı profilini günceller

## ❌ Error Handling

### HTTP Status Codes

- `200` - Başarılı
- `201` - Oluşturuldu
- `400` - Bad Request (Geçersiz veri)
- `401` - Unauthorized (Yetkisiz erişim)
- `403` - Forbidden (Yasaklı erişim)
- `404` - Not Found (Bulunamadı)
- `409` - Conflict (Çakışma)
- `500` - Internal Server Error (Sunucu hatası)

### Error Response Examples

#### Validation Error
```json
{
  "success": false,
  "error": "Geçersiz veri",
  "details": [
    {
      "field": "email",
      "message": "Geçerli bir email adresi giriniz"
    }
  ]
}
```

#### Authentication Error
```json
{
  "success": false,
  "error": "Yetkisiz erişim"
}
```

#### Not Found Error
```json
{
  "success": false,
  "error": "Hasta bulunamadı"
}
```

#### Duplicate Error
```json
{
  "success": false,
  "error": "Bu telefon veya e-posta ile kayıtlı hasta var"
}
```

## 🚦 Rate Limiting

API endpoint'leri rate limiting ile korunmaktadır:

- **Genel limit**: 100 istek/dakika
- **Authentication**: 10 istek/dakika
- **File upload**: 5 istek/dakika

Rate limit aşıldığında:
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

## 📝 Examples

### Hasta Oluşturma
```javascript
const response = await fetch('/api/patients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Ahmet Yılmaz',
    email: 'ahmet@email.com',
    phone: '+905551234567',
    birthDate: '1990-01-01',
    gender: 'MALE'
  })
});

const data = await response.json();
console.log(data);
```

### Teklif Oluşturma
```javascript
const response = await fetch('/api/offers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    patientInfo: {
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      phone: '+905551234567',
      email: 'ahmet@email.com'
    },
    treatmentDetails: [
      {
        treatmentKey: 'filling',
        treatmentName: 'Diş Dolgusu',
        selectedTeeth: [11, 12, 13],
        toothPricing: [
          {
            toothNumber: 11,
            price: 500.00,
            currency: 'TRY'
          }
        ]
      }
    ]
  })
});

const data = await response.json();
console.log(data);
```

### Rapor Alma
```javascript
const response = await fetch('/api/reports', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    currency: 'TRY',
    page: 1,
    pageSize: 20
  })
});

const data = await response.json();
console.log(data.summary);
```

## 🔧 Development

### Local Development
```bash
# API'yi test et
curl http://localhost:3000/api/patients

# Postman collection kullan
# docs/postman/clinikoop-api.postman_collection.json
```

### Testing
```bash
# API testlerini çalıştır
npm run test:api

# Belirli endpoint'i test et
npm run test:api -- --grep "patients"
```

## 📚 Additional Resources

- [Database Schema](./database-schema.md)
- [Authentication Guide](./authentication.md)
- [Deployment Guide](./deployment.md)
- [Postman Collection](./postman/clinikoop-api.postman_collection.json)

## 🤝 Support

API ile ilgili sorularınız için:
- **Email**: support@clinikoop.com
- **Documentation**: https://docs.clinikoop.com
- **GitHub Issues**: https://github.com/clinikoop/clinikoop/issues 