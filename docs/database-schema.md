# 🗄️ Database Schema

Bu dokümantasyon, Clinikoop platformunun veritabanı yapısını ve ilişkilerini detaylı olarak açıklar.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Database Provider](#database-provider)
- [Ana Modeller](#ana-modeller)
- [İlişkiler](#ilişkiler)
- [Indexler](#indexler)
- [Constraints](#constraints)
- [Migration Geçmişi](#migration-geçmişi)
- [Seed Data](#seed-data)
- [Performance Optimizasyonları](#performance-optimizasyonları)

## 🌐 Genel Bakış

Clinikoop, **multi-tenant SaaS** platformu olarak tasarlanmıştır. Her klinik kendi verilerini izole bir şekilde yönetir.

### 🏗️ Mimari Özellikler

- **Multi-tenant Architecture** - Clinic bazlı veri izolasyonu
- **Soft Delete** - Veri silme yerine pasif hale getirme
- **Audit Trail** - Oluşturma ve güncelleme tarihleri
- **Role-based Access** - Kullanıcı yetkilendirme sistemi
- **Flexible Settings** - Dinamik ayar sistemi

## 🗃️ Database Provider

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 📊 Desteklenen Veritabanları

- **Production**: PostgreSQL (Vercel Postgres)
- **Development**: SQLite (Local development)
- **Testing**: SQLite (Test environment)

## 🏥 Ana Modeller

### 1. Clinic (Klinik)

Multi-tenant yapının ana modeli. Her klinik kendi subdomain'inde çalışır.

```prisma
model Clinic {
  id                    String   @id @default(cuid())
  name                  String
  subdomain             String   @unique
  domain                String?
  isActive              Boolean  @default(true)
  maxUsers              Int      @default(10)
  maxPatients           Int      @default(1000)
  maxOffers             Int      @default(5000)
  subscriptionStartDate DateTime?
  subscriptionEndDate   DateTime?
  subscriptionStatus    String   @default("TRIAL")
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relations
  users                 ClinicUser[]
  patients              Patient[]
  offers                Offer[]
  patientOffers         PatientOffer[]
  reminders             Reminder[]
  notes                 Note[]
  settings              ClinicSetting[]
  tickets               SupportTicket[]
  offerStatuses         OfferStatus[]
  referralSources       ReferralSource[]
  supportCategories     SupportCategory[]
  supportPriorities     SupportPriority[]
  supportStatuses       SupportStatus[]
  pdfTemplates          PDFTemplate[]

  @@map("clinics")
}
```

**Alan Açıklamaları:**
- `id`: Benzersiz klinik ID'si (CUID)
- `name`: Klinik adı
- `subdomain`: Alt domain (örn: demo.clinikoop.com)
- `domain`: Özel domain (opsiyonel)
- `isActive`: Klinik aktif mi?
- `maxUsers`: Maksimum kullanıcı sayısı
- `maxPatients`: Maksimum hasta sayısı
- `maxOffers`: Maksimum teklif sayısı
- `subscriptionStartDate`: Abonelik başlangıç tarihi
- `subscriptionEndDate`: Abonelik bitiş tarihi
- `subscriptionStatus`: Abonelik durumu (TRIAL, ACTIVE, EXPIRED)

### 2. ClinicUser (Klinik Kullanıcısı)

Klinik çalışanları ve yöneticileri.

```prisma
model ClinicUser {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String
  role        String   @default("USER")
  password    String
  isActive    Boolean  @default(true)
  permissions String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  clinicId    String
  clinic      Clinic   @relation(fields: [clinicId], references: [id])

  // Relations
  patients    Patient[]
  offers      Offer[]
  reminders   Reminder[]
  notes       Note[]
  messages    SupportMessage[]
  createdTickets SupportTicket[] @relation("TicketCreatedBy")
  assignedTickets SupportTicket[] @relation("TicketAssignedTo")

  @@map("clinic_users")
}
```

**Alan Açıklamaları:**
- `id`: Benzersiz kullanıcı ID'si
- `email`: E-posta adresi (unique)
- `name`: Kullanıcı adı
- `role`: Rol (USER, ADMIN, SUPER_ADMIN)
- `password`: Şifrelenmiş parola
- `isActive`: Kullanıcı aktif mi?
- `permissions`: JSON formatında yetkiler
- `clinicId`: Bağlı olduğu klinik

### 3. Patient (Hasta)

Hasta kayıtları ve bilgileri.

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

  // Medical fields
  medicalHistory    String?
  allergies         String?
  medications       String?
  emergencyContact  String?

  // Relations
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

**Alan Açıklamaları:**
- `id`: Benzersiz hasta ID'si
- `name`: Hasta adı
- `email`: E-posta adresi
- `phone`: Telefon numarası
- `birthDate`: Doğum tarihi
- `gender`: Cinsiyet (MALE, FEMALE, OTHER)
- `address`: Adres
- `city`: Şehir
- `country`: Ülke (varsayılan: TR)
- `nationality`: Uyruk
- `phoneCountry`: Telefon ülke kodu
- `notes`: Notlar
- `isActive`: Hasta aktif mi?
- `isDeleted`: Soft delete durumu
- `referralSourceId`: Hasta kaynağı
- `medicalHistory`: Tıbbi geçmiş
- `allergies`: Alerjiler
- `medications`: Kullandığı ilaçlar
- `emergencyContact`: Acil durum iletişim

### 4. Offer (Teklif)

Tedavi teklifleri ve detayları.

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

  // Relations
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

**Alan Açıklamaları:**
- `id`: Benzersiz teklif ID'si
- `title`: Teklif başlığı
- `description`: Teklif açıklaması
- `totalPrice`: Toplam fiyat
- `currency`: Para birimi (varsayılan: TRY)
- `validUntil`: Geçerlilik tarihi
- `isDeleted`: Soft delete durumu
- `slug`: URL-friendly slug
- `pdfTemplateId`: PDF şablonu
- `estimatedDuration`: Tahmini süre (gün)

### 5. Treatment (Tedavi)

Teklif içindeki tedavi detayları.

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

**Alan Açıklamaları:**
- `id`: Benzersiz tedavi ID'si
- `name`: Tedavi adı
- `description`: Tedavi açıklaması
- `price`: Fiyat
- `quantity`: Miktar
- `currency`: Para birimi
- `category`: Kategori
- `key`: Tedavi anahtarı
- `selectedTeeth`: Seçili dişler (JSON)
- `estimatedDuration`: Tahmini süre
- `order`: Sıralama
- `isDeleted`: Soft delete durumu

### 6. Reminder (Hatırlatma)

Hasta ve teklif takibi için hatırlatmalar.

```prisma
model Reminder {
  id          String   @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime
  isCompleted Boolean  @default(false)
  isPinned    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  clinicId    String
  clinic      Clinic   @relation(fields: [clinicId], references: [id])
  
  patientId   String?
  patient     Patient? @relation(fields: [patientId], references: [id])
  
  offerId     String?
  offer       Offer? @relation(fields: [offerId], references: [id])
  
  userId      String
  user        ClinicUser @relation(fields: [userId], references: [id])

  @@map("reminders")
}
```

**Alan Açıklamaları:**
- `id`: Benzersiz hatırlatma ID'si
- `title`: Başlık
- `description`: Açıklama
- `dueDate`: Son tarih
- `isCompleted`: Tamamlandı mı?
- `isPinned`: Sabitlendi mi?
- `patientId`: İlgili hasta (opsiyonel)
- `offerId`: İlgili teklif (opsiyonel)
- `userId`: Oluşturan kullanıcı

### 7. SupportTicket (Destek Talebi)

Destek sistemi ana modeli.

```prisma
model SupportTicket {
  id            String   @id @default(cuid())
  ticketNumber  String   @unique
  subject       String
  description   String
  isUrgent      Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  clinicId      String
  clinic        Clinic   @relation(fields: [clinicId], references: [id])
  
  categoryId    String?
  category      SupportCategory? @relation(fields: [categoryId], references: [id])
  
  priorityId    String?
  priority      SupportPriority? @relation(fields: [priorityId], references: [id])
  
  statusId      String?
  status        SupportStatus? @relation(fields: [statusId], references: [id])
  
  createdById   String
  createdBy     ClinicUser @relation("TicketCreatedBy", fields: [createdById], references: [id])
  
  assignedToId  String?
  assignedTo    ClinicUser? @relation("TicketAssignedTo", fields: [assignedToId], references: [id])

  messages      SupportMessage[]
  attachments   SupportAttachment[]

  @@map("support_tickets")
}
```

**Alan Açıklamaları:**
- `id`: Benzersiz talep ID'si
- `ticketNumber`: Talep numarası (unique)
- `subject`: Konu
- `description`: Açıklama
- `isUrgent`: Acil mi?
- `categoryId`: Kategori
- `priorityId`: Öncelik
- `statusId`: Durum
- `createdById`: Oluşturan kullanıcı
- `assignedToId`: Atanan kullanıcı

### 8. PDFTemplate (PDF Şablonu)

Özelleştirilebilir PDF şablonları.

```prisma
model PDFTemplate {
  id          String   @id @default(cuid())
  name        String
  description String?
  content     String
  isDefault   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  clinicId    String
  clinic      Clinic   @relation(fields: [clinicId], references: [id])

  offers      Offer[]

  @@map("pdf_templates")
}
```

**Alan Açıklamaları:**
- `id`: Benzersiz şablon ID'si
- `name`: Şablon adı
- `description`: Açıklama
- `content`: HTML içerik
- `isDefault`: Varsayılan şablon mu?

## 🔗 İlişkiler

### Ana İlişki Yapısı

```mermaid
erDiagram
    Clinic ||--o{ ClinicUser : has
    Clinic ||--o{ Patient : has
    Clinic ||--o{ Offer : has
    Clinic ||--o{ SupportTicket : has
    
    ClinicUser ||--o{ Patient : creates
    ClinicUser ||--o{ Offer : creates
    ClinicUser ||--o{ SupportTicket : creates
    
    Patient ||--o{ PatientOffer : has
    Offer ||--o{ PatientOffer : belongs_to
    Offer ||--o{ Treatment : contains
    
    SupportTicket ||--o{ SupportMessage : has
    SupportTicket ||--o{ SupportAttachment : has
```

### İlişki Detayları

#### 1. Clinic - ClinicUser (One-to-Many)
```prisma
// Clinic
users ClinicUser[]

// ClinicUser
clinicId String
clinic   Clinic @relation(fields: [clinicId], references: [id])
```

#### 2. Clinic - Patient (One-to-Many)
```prisma
// Clinic
patients Patient[]

// Patient
clinicId String
clinic   Clinic @relation(fields: [clinicId], references: [id])
```

#### 3. Patient - Offer (Many-to-Many)
```prisma
// Patient
offers PatientOffer[]

// Offer
patientOffers PatientOffer[]

// PatientOffer (Junction Table)
patientId String
offerId   String
patient   Patient @relation(fields: [patientId], references: [id])
offer     Offer @relation(fields: [offerId], references: [id])
```

#### 4. Offer - Treatment (One-to-Many)
```prisma
// Offer
treatments Treatment[]

// Treatment
offerId String
offer   Offer @relation(fields: [offerId], references: [id])
```

#### 5. SupportTicket - SupportMessage (One-to-Many)
```prisma
// SupportTicket
messages SupportMessage[]

// SupportMessage
ticketId String
ticket   SupportTicket @relation(fields: [ticketId], references: [id])
```

## 📊 Indexler

### Otomatik Indexler

```sql
-- Primary Key Indexes
CREATE UNIQUE INDEX "clinics_pkey" ON "clinics"("id");
CREATE UNIQUE INDEX "clinic_users_pkey" ON "clinic_users"("id");
CREATE UNIQUE INDEX "patients_pkey" ON "patients"("id");
CREATE UNIQUE INDEX "offers_pkey" ON "offers"("id");

-- Unique Indexes
CREATE UNIQUE INDEX "clinics_subdomain_key" ON "clinics"("subdomain");
CREATE UNIQUE INDEX "clinic_users_email_key" ON "clinic_users"("email");
CREATE UNIQUE INDEX "offers_slug_key" ON "offers"("slug");
CREATE UNIQUE INDEX "support_tickets_ticketNumber_key" ON "support_tickets"("ticketNumber");

-- Foreign Key Indexes
CREATE INDEX "clinic_users_clinicId_idx" ON "clinic_users"("clinicId");
CREATE INDEX "patients_clinicId_idx" ON "patients"("clinicId");
CREATE INDEX "offers_clinicId_idx" ON "offers"("clinicId");
CREATE INDEX "treatments_offerId_idx" ON "treatments"("offerId");
```

### Özel Indexler

```sql
-- Performance Indexes
CREATE INDEX "patients_email_idx" ON "patients"("email");
CREATE INDEX "patients_phone_idx" ON "patients"("phone");
CREATE INDEX "offers_createdAt_idx" ON "offers"("createdAt");
CREATE INDEX "reminders_dueDate_idx" ON "reminders"("dueDate");

-- Multi-tenant Indexes
CREATE INDEX "patients_clinicId_isActive_idx" ON "patients"("clinicId", "isActive");
CREATE INDEX "offers_clinicId_isDeleted_idx" ON "offers"("clinicId", "isDeleted");
CREATE INDEX "support_tickets_clinicId_statusId_idx" ON "support_tickets"("clinicId", "statusId");
```

## 🔒 Constraints

### Unique Constraints

```prisma
// Clinic
subdomain String @unique

// ClinicUser
email String @unique

// Offer
slug String @unique

// SupportTicket
ticketNumber String @unique

// PatientOffer
@@unique([patientId, offerId])

// ClinicSetting
@@unique([clinicId, key])
```

### Foreign Key Constraints

```prisma
// ClinicUser -> Clinic
clinicId String
clinic   Clinic @relation(fields: [clinicId], references: [id])

// Patient -> Clinic
clinicId String
clinic   Clinic @relation(fields: [clinicId], references: [id])

// Offer -> Clinic
clinicId String
clinic   Clinic @relation(fields: [clinicId], references: [id])
```

## 📈 Migration Geçmişi

### Önemli Migration'lar

1. **20250716172435_init** - İlk schema oluşturma
2. **20250716200939_add_multi_tenant_structure** - Multi-tenant yapı
3. **20250717234831_add_subscription_fields** - Abonelik alanları
4. **20250718210613_add_analytics_models** - Analitik modeller
5. **20250718212139_add_support_system_models** - Destek sistemi

### Migration Komutları

```bash
# Migration oluştur
npx prisma migrate dev --name migration_name

# Migration uygula (production)
npx prisma migrate deploy

# Migration durumunu kontrol et
npx prisma migrate status

# Schema'ya göre migration oluştur
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma
```

## 🌱 Seed Data

### Varsayılan Veriler

```typescript
// Default offer statuses
const defaultStatuses = [
  { name: 'draft', displayName: 'Taslak', color: '#6B7280', order: 1 },
  { name: 'sent', displayName: 'Gönderildi', color: '#3B82F6', order: 2 },
  { name: 'accepted', displayName: 'Kabul Edildi', color: '#10B981', order: 3 },
  { name: 'rejected', displayName: 'Reddedildi', color: '#EF4444', order: 4 }
];

// Default referral sources
const defaultSources = [
  { name: 'google', displayName: 'Google Arama', color: '#4285F4' },
  { name: 'instagram', displayName: 'Instagram', color: '#E4405F' },
  { name: 'facebook', displayName: 'Facebook', color: '#1877F2' },
  { name: 'referral', displayName: 'Hasta Tavsiyesi', color: '#10B981' }
];

// Default support categories
const defaultCategories = [
  { name: 'technical', displayName: 'Teknik Sorun', order: 1 },
  { name: 'usage', displayName: 'Kullanım', order: 2 },
  { name: 'billing', displayName: 'Ödeme', order: 3 },
  { name: 'other', displayName: 'Diğer', order: 4 }
];
```

### Seed Komutları

```bash
# Seed data çalıştır
npx prisma db seed

# Belirli seed'i çalıştır
npm run seed:statuses
npm run seed:sources
npm run seed:categories
```

## ⚡ Performance Optimizasyonları

### 1. Query Optimizasyonları

```typescript
// N+1 Problem Çözümü
const patients = await prisma.patient.findMany({
  where: { clinicId },
  include: {
    referralSource: true,
    createdBy: true,
    offers: {
      include: {
        status: true
      }
    }
  }
});

// Pagination
const offers = await prisma.offer.findMany({
  where: { clinicId, isDeleted: false },
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
});

// Aggregation
const stats = await prisma.offer.aggregate({
  where: { clinicId, isDeleted: false },
  _count: { id: true },
  _sum: { totalPrice: true }
});
```

### 2. Index Stratejileri

```sql
-- Composite Indexes
CREATE INDEX "offers_clinic_status_created" ON "offers"("clinicId", "statusId", "createdAt");

-- Partial Indexes
CREATE INDEX "active_patients" ON "patients"("clinicId") WHERE "isActive" = true;

-- Covering Indexes
CREATE INDEX "patient_search" ON "patients"("clinicId", "name", "email", "phone");
```

### 3. Connection Pooling

```typescript
// Prisma Client Singleton
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 4. Caching Stratejileri

```typescript
// Redis Cache
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

// Cache key pattern
const cacheKey = `clinic:${clinicId}:patients:${page}`

// Cache implementation
const cachedData = await redis.get(cacheKey)
if (cachedData) {
  return JSON.parse(cachedData)
}

const data = await prisma.patient.findMany({...})
await redis.setex(cacheKey, 300, JSON.stringify(data)) // 5 dakika
```

## 🔍 Monitoring ve Analytics

### Database Metrics

```typescript
// Query Performance
const slowQueries = await prisma.$queryRaw`
  SELECT query, mean_time, calls
  FROM pg_stat_statements
  WHERE mean_time > 100
  ORDER BY mean_time DESC
  LIMIT 10
`;

// Connection Stats
const connectionStats = await prisma.$queryRaw`
  SELECT 
    state,
    count(*) as count
  FROM pg_stat_activity
  GROUP BY state
`;

// Table Sizes
const tableSizes = await prisma.$queryRaw`
  SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
`;
```

### Health Checks

```typescript
// Database Health Check
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', timestamp: new Date() }
  } catch (error) {
    return { status: 'unhealthy', error: error.message, timestamp: new Date() }
  }
}

// Connection Pool Health
export async function checkConnectionPool() {
  const pool = prisma.$connect()
  const stats = await pool.getStats()
  return {
    active: stats.active,
    idle: stats.idle,
    total: stats.total
  }
}
```

## 🚀 Deployment

### Production Checklist

- [ ] Database migration'ları uygulandı
- [ ] Seed data yüklendi
- [ ] Index'ler oluşturuldu
- [ ] Connection pooling ayarlandı
- [ ] Backup stratejisi hazırlandı
- [ ] Monitoring kuruldu
- [ ] Performance testleri yapıldı

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Connection Pool
DATABASE_CONNECTION_LIMIT=20
DATABASE_POOL_TIMEOUT=30000

# Monitoring
DATABASE_MONITORING=true
DATABASE_LOG_QUERIES=false
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Database Design Best Practices](./database-best-practices.md)
- [Migration Guide](./migration-guide.md)
- [Performance Tuning](./performance-tuning.md)

## 🤝 Support

Database ile ilgili sorularınız için:
- **Email**: support@clinikoop.com
- **Documentation**: https://docs.clinikoop.com
- **GitHub Issues**: https://github.com/clinikoop/clinikoop/issues 