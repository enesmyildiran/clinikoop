# 🏢 Admin Modülü

Bu dokümantasyon, Clinikoop platformunun admin modülünün tüm özelliklerini ve yönetim fonksiyonlarını detaylı olarak açıklar.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Admin Paneli Erişimi](#admin-paneli-erisimi)
- [Kullanıcı Yönetimi](#kullanıcı-yönetimi)
- [Klinik Yönetimi](#klinik-yönetimi)
- [Destek Sistemi](#destek-sistemi)
- [Analytics & Raporlama](#analytics--raporlama)
- [Sistem Ayarları](#sistem-ayarları)
- [Log Yönetimi](#log-yönetimi)
- [Paket Yönetimi](#paket-yönetimi)

## 🌐 Genel Bakış

Admin modülü, Clinikoop platformunun sistem yönetimi için tasarlanmış kapsamlı bir yönetim panelidir.

### Admin Modülü Özellikleri
- **Multi-tenant yönetimi** - Birden fazla klinik yönetimi
- **Kullanıcı yönetimi** - Rol tabanlı yetkilendirme
- **Destek sistemi** - Merkezi destek yönetimi
- **Analytics** - Sistem performans ve kullanım analizi
- **Log yönetimi** - Sistem logları ve aktivite takibi
- **Paket yönetimi** - Abonelik ve paket yönetimi

### Erişim Seviyeleri
- **SUPER_ADMIN** - Tam sistem yönetimi
- **ADMIN** - Klinik yönetimi (sınırlı)
- **SALES** - Satış ve müşteri yönetimi
- **DOCTOR** - Hasta ve tedavi yönetimi
- **ASSISTANT** - Asistan işlemleri

## 🔐 Admin Paneli Erişimi

### Erişim URL'leri
```bash
# Ana admin paneli
/admin

# Alt modüller
/admin/dashboard          # Dashboard
/admin/users              # Kullanıcı yönetimi
/admin/clinics            # Klinik yönetimi
/admin/support            # Destek sistemi
/admin/analytics          # Analytics
/admin/logs               # Log yönetimi
/admin/packages           # Paket yönetimi
/admin/module-settings    # Modül ayarları
```

### Yetkilendirme Kontrolü
```typescript
// Middleware kontrolü
// src/middleware.ts
export function middleware(request: NextRequest) {
  // Admin route kontrolü
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // SUPER_ADMIN kontrolü
    if (!session?.user?.isSuperAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
}
```

## 👥 Kullanıcı Yönetimi

### Kullanıcı Rolleri ve Yetkileri

#### SUPER_ADMIN (Sistem Yöneticisi)
- **Tam sistem yönetimi**
- Tüm klinikleri görüntüleme ve yönetme
- Tüm kullanıcıları yönetme
- Sistem ayarlarını değiştirme
- Destek sistemini yönetme

#### ADMIN (Klinik Yöneticisi)
- **Kendi kliniğini yönetme**
- Klinik kullanıcılarını görüntüleme
- Klinik ayarlarını değiştirme
- Klinik raporlarını görüntüleme

#### SALES (Satış)
- **Müşteri yönetimi**
- Teklif oluşturma ve yönetme
- Hasta takibi
- Satış raporları

#### DOCTOR (Doktor)
- **Hasta yönetimi**
- Tedavi planları
- Hasta geçmişi
- Tıbbi notlar

#### ASSISTANT (Asistan)
- **Destek işlemleri**
- Randevu yönetimi
- Hasta iletişimi
- Dosya yönetimi

### Kullanıcı Yönetimi Özellikleri

#### Admin Tarafında (/admin/users)
```typescript
// Kullanıcı listeleme
GET /api/admin/users

// Yeni kullanıcı oluşturma
POST /api/admin/users

// Kullanıcı silme
DELETE /api/admin/users/[id]

// Kullanıcı düzenleme
PUT /api/admin/users/[id]
```

**Özellikler:**
- ✅ Tüm kliniklerdeki kullanıcıları listeleme
- ✅ Klinik bazlı filtreleme
- ✅ Rol bazlı filtreleme
- ✅ Kullanıcı durumu yönetimi
- ✅ Kullanıcı düzenleme ve silme

#### Klinik Tarafında (/site/users)
```typescript
// Klinik kullanıcılarını listeleme
GET /api/users
```

**Özellikler:**
- ✅ Sadece kendi kliniğindeki kullanıcıları görüntüleme
- ✅ Kullanıcı ekleme butonu YOK (güvenlik)
- ✅ Kullanıcı durumu görüntüleme
- ✅ Rol bazlı filtreleme

### Kullanıcı Oluşturma Süreci

#### 1. Admin Tarafında Kullanıcı Oluşturma
```typescript
// Yeni kullanıcı formu
{
  name: string,
  email: string,
  role: 'ADMIN' | 'SALES' | 'DOCTOR' | 'ASSISTANT',
  clinicId: string,
  permissions?: string[] // CUSTOM rol için
}
```

#### 2. Geçici Şifre Oluşturma
```typescript
// Otomatik geçici şifre oluşturma
const tempPassword = randomBytes(8).toString('hex');
const hashedPassword = await bcrypt.hash(tempPassword, 12);
```

#### 3. E-posta Bildirimi
```typescript
// SMTP entegrasyonu (gelecek)
// Şimdilik konsola yazdırma
console.log(`Yeni kullanıcı: ${email}`);
console.log(`Geçici şifre: ${tempPassword}`);
```

## 🏥 Klinik Yönetimi

### Klinik Yönetimi Özellikleri

#### Admin Tarafında (/admin/clinics)
```typescript
// Klinik listeleme
GET /api/admin/clinics

// Yeni klinik oluşturma
POST /api/admin/clinics

// Klinik düzenleme
PUT /api/admin/clinics/[id]

// Klinik silme
DELETE /api/admin/clinics/[id]
```

**Özellikler:**
- ✅ Tüm klinikleri listeleme
- ✅ Klinik detaylarını görüntüleme
- ✅ Klinik ayarlarını düzenleme
- ✅ Klinik kullanıcılarını yönetme
- ✅ Klinik performansını izleme

### Klinik Bilgileri
```typescript
interface Clinic {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  timezone: string;
  currency: string;
  subscription: {
    plan: string;
    status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
    startDate: Date;
    endDate: Date;
  };
  settings: {
    logo: string;
    theme: string;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 🆘 Destek Sistemi

### Destek Sistemi Özellikleri

#### Admin Tarafında (/admin/support)
```typescript
// Destek taleplerini listeleme
GET /api/admin/support/tickets

// Destek talebi detayı
GET /api/admin/support/tickets/[id]

// Destek talebi güncelleme
PUT /api/admin/support/tickets/[id]

// Destek kategorileri
GET /api/admin/support/categories

// Destek öncelikleri
GET /api/admin/support/priorities
```

**Özellikler:**
- ✅ Tüm kliniklerden gelen destek talepleri
- ✅ Kategori bazlı filtreleme
- ✅ Öncelik bazlı sıralama
- ✅ Destek talebi durumu yönetimi
- ✅ Yanıt ve çözüm takibi

#### Klinik Tarafında (/site/support)
```typescript
// Destek talebi oluşturma
POST /api/support/tickets

// Destek taleplerini listeleme
GET /api/support/tickets

// Destek talebi detayı
GET /api/support/tickets/[id]
```

**Özellikler:**
- ✅ Sadece kendi destek taleplerini görüntüleme
- ✅ Yeni destek talebi oluşturma
- ✅ Destek talebi durumu takibi
- ✅ Yanıt ve çözüm görüntüleme

### Destek Talebi Süreci

#### 1. Destek Talebi Oluşturma
```typescript
{
  subject: string,
  description: string,
  category: string,
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  attachments?: File[]
}
```

#### 2. Destek Talebi Durumları
- **OPEN** - Açık
- **IN_PROGRESS** - İşlemde
- **WAITING_FOR_USER** - Kullanıcı yanıtı bekleniyor
- **RESOLVED** - Çözüldü
- **CLOSED** - Kapatıldı

#### 3. Destek Kategorileri
- **TECHNICAL** - Teknik sorunlar
- **BILLING** - Faturalama
- **FEATURE_REQUEST** - Özellik talebi
- **BUG_REPORT** - Hata bildirimi
- **GENERAL** - Genel sorular

## 📊 Analytics & Raporlama

### Analytics Modülü (/admin/analytics)

#### Sistem Performans Metrikleri
```typescript
// Sistem metrikleri
{
  totalUsers: number,
  totalClinics: number,
  totalOffers: number,
  totalPatients: number,
  activeSubscriptions: number,
  monthlyRevenue: number,
  systemUptime: number
}
```

#### Klinik Performans Metrikleri
```typescript
// Klinik bazlı metrikler
{
  clinicId: string,
  totalPatients: number,
  totalOffers: number,
  conversionRate: number,
  averageOfferValue: number,
  monthlyGrowth: number
}
```

#### Kullanım Analizi
```typescript
// Kullanım istatistikleri
{
  dailyActiveUsers: number,
  monthlyActiveUsers: number,
  featureUsage: {
    offers: number,
    patients: number,
    reports: number,
    support: number
  },
  performanceMetrics: {
    pageLoadTime: number,
    apiResponseTime: number,
    errorRate: number
  }
}
```

### Raporlama Özellikleri
- **Gerçek zamanlı dashboard**
- **Tarih bazlı filtreleme**
- **Klinik bazlı raporlama**
- **Export (PDF, Excel)**
- **Otomatik rapor gönderimi**

## ⚙️ Sistem Ayarları

### Modül Ayarları (/admin/module-settings)

#### Genel Ayarlar
```typescript
// Sistem genel ayarları
{
  systemName: string,
  systemEmail: string,
  maintenanceMode: boolean,
  registrationEnabled: boolean,
  emailNotifications: boolean,
  smsNotifications: boolean
}
```

#### E-posta Ayarları
```typescript
// SMTP ayarları
{
  smtpHost: string,
  smtpPort: number,
  smtpUser: string,
  smtpPassword: string,
  smtpSecure: boolean,
  fromEmail: string,
  fromName: string
}
```

#### Ödeme Ayarları
```typescript
// Ödeme sistemi ayarları
{
  stripeEnabled: boolean,
  stripePublicKey: string,
  stripeSecretKey: string,
  paypalEnabled: boolean,
  paypalClientId: string,
  paypalSecret: string
}
```

#### Güvenlik Ayarları
```typescript
// Güvenlik ayarları
{
  passwordMinLength: number,
  passwordRequireSpecial: boolean,
  sessionTimeout: number,
  maxLoginAttempts: number,
  twoFactorEnabled: boolean,
  ipWhitelist: string[]
}
```

## 📝 Log Yönetimi

### Log Sistemi (/admin/logs)

#### Aktivite Logları
```typescript
// Kullanıcı aktivite logları
{
  id: string,
  userId: string,
  action: string,
  resource: string,
  resourceId: string,
  details: object,
  ipAddress: string,
  userAgent: string,
  timestamp: Date
}
```

#### Sistem Logları
```typescript
// Sistem logları
{
  id: string,
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG',
  message: string,
  stackTrace?: string,
  context: object,
  timestamp: Date
}
```

#### Log Filtreleme
- **Tarih aralığı** filtreleme
- **Log seviyesi** filtreleme
- **Kullanıcı** bazlı filtreleme
- **Aksiyon** bazlı filtreleme
- **Klinik** bazlı filtreleme

### Log Temizleme
```typescript
// Otomatik log temizleme
// 30 günden eski logları sil
DELETE FROM activity_logs WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM system_logs WHERE created_at < NOW() - INTERVAL '30 days';
```

## 📦 Paket Yönetimi

### Paket Sistemi (/admin/packages)

#### Paket Tipleri
```typescript
// Abonelik paketleri
{
  id: string,
  name: string,
  description: string,
  price: number,
  currency: string,
  duration: number, // gün
  features: {
    maxUsers: number,
    maxPatients: number,
    maxOffers: number,
    supportLevel: 'BASIC' | 'PREMIUM' | 'ENTERPRISE',
    customDomain: boolean,
    apiAccess: boolean,
    whiteLabel: boolean
  },
  isActive: boolean
}
```

#### Paket Yönetimi
- **Paket oluşturma** ve düzenleme
- **Fiyat yönetimi**
- **Özellik yönetimi**
- **Paket aktivasyon/deaktivasyon**
- **Abonelik yönetimi**

### Abonelik Yönetimi
```typescript
// Klinik abonelikleri
{
  id: string,
  clinicId: string,
  packageId: string,
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'CANCELLED',
  startDate: Date,
  endDate: Date,
  autoRenew: boolean,
  paymentMethod: string,
  lastPaymentDate: Date,
  nextPaymentDate: Date
}
```

## 🔧 Teknik Detaylar

### API Endpoints

#### Admin API Routes
```typescript
// Kullanıcı yönetimi
/api/admin/users
/api/admin/users/[id]

// Klinik yönetimi
/api/admin/clinics
/api/admin/clinics/[id]

// Destek sistemi
/api/admin/support/tickets
/api/admin/support/categories
/api/admin/support/priorities

// Analytics
/api/admin/analytics
/api/admin/analytics/clinics
/api/admin/analytics/users

// Log yönetimi
/api/admin/logs/activity
/api/admin/logs/system

// Paket yönetimi
/api/admin/packages
/api/admin/packages/[id]
```

### Veritabanı Modelleri

#### Admin İlgili Modeller
```prisma
// Kullanıcı modeli
model ClinicUser {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  password    String
  role        UserRole
  clinicId    String
  clinic      Clinic   @relation(fields: [clinicId], references: [id])
  permissions String?  // JSON string
  isActive    Boolean  @default(false)
  lastLoginAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Klinik modeli
model Clinic {
  id           String   @id @default(cuid())
  name         String
  email        String
  phone        String?
  address      String?
  city         String?
  country      String?
  timezone     String   @default("Europe/Istanbul")
  currency     String   @default("TRY")
  subscription Json?    // Subscription details
  settings     Json?    // Clinic settings
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// Destek modeli
model SupportTicket {
  id          String   @id @default(cuid())
  ticketNumber String  @unique
  subject     String
  description String
  category    String
  priority    String
  status      String   @default("OPEN")
  clinicId    String
  clinic      Clinic   @relation(fields: [clinicId], references: [id])
  createdBy   String
  assignedTo  String?
  isUrgent    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Güvenlik Önlemleri

#### Yetkilendirme Kontrolü
```typescript
// Middleware'de admin kontrolü
export function middleware(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session?.user?.isSuperAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
}
```

#### API Güvenliği
```typescript
// API route'larda yetki kontrolü
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !(session.user as any)?.isSuperAdmin) {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }
  
  // İşlem devam eder...
}
```

## 📋 Admin Checklist

### Günlük Kontroller
- [ ] Sistem logları kontrol edildi
- [ ] Destek talepleri yanıtlandı
- [ ] Sistem performansı kontrol edildi
- [ ] Yedekleme durumu kontrol edildi

### Haftalık Kontroller
- [ ] Kullanıcı aktiviteleri incelendi
- [ ] Klinik performansları değerlendirildi
- [ ] Güvenlik logları kontrol edildi
- [ ] Sistem güncellemeleri planlandı

### Aylık Kontroller
- [ ] Abonelik yenilemeleri kontrol edildi
- [ ] Sistem performans raporu hazırlandı
- [ ] Güvenlik denetimi yapıldı
- [ ] Yedekleme testleri yapıldı

## 🚨 Acil Durum Prosedürleri

### Sistem Kesintisi
1. **Durum tespiti** - Logları kontrol et
2. **Kullanıcı bilgilendirmesi** - E-posta/SMS gönder
3. **Teknik müdahale** - Sorunu çöz
4. **Durum güncellemesi** - Kullanıcıları bilgilendir

### Güvenlik İhlali
1. **Erişimi kes** - Şüpheli hesapları devre dışı bırak
2. **Log analizi** - İhlal kaynağını tespit et
3. **Güvenlik güncellemesi** - Güvenlik açıklarını kapat
4. **Kullanıcı bilgilendirmesi** - Şifre değişikliği talep et

### Veri Kaybı
1. **Yedekten geri yükleme** - En son yedeği geri yükle
2. **Veri bütünlüğü kontrolü** - Verilerin doğruluğunu kontrol et
3. **Kullanıcı bilgilendirmesi** - Durumu açıkla
4. **Önlem alma** - Gelecekteki kayıpları önle

---

**Son Güncelleme**: 2024-01-XX  
**Versiyon**: 1.0.0  
**Durum**: Production Ready 