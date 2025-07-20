# 🔄 Migration Rehberi

Bu dokümantasyon, Clinikoop platformunun veritabanı migration'larını ve önemli değişiklikleri açıklar.

## 📋 İçindekiler

- [Migration Geçmişi](#migration-geçmişi)
- [Önemli Migration'lar](#önemli-migrationlar)
- [PatientOffer clinicId Migration](#patientoffer-clinicid-migration)
- [Multi-tenant Migration](#multi-tenant-migration)
- [Production Migration](#production-migration)
- [Rollback Stratejileri](#rollback-stratejileri)

## 📈 Migration Geçmişi

### Son Migration'lar

1. **20250720211648_add_clinicid_to_patientoffer** - PatientOffer clinicId eklendi
2. **20250720203715_remove_status_string** - Status string alanları kaldırıldı
3. **20250720190711_add_clinic_id_to_models** - Clinic ID'leri eklendi
4. **20250718213704_add_fields_to_analytics_event** - Analytics alanları eklendi
5. **20250718213623_add_stack_trace_to_system_log** - System log stack trace eklendi

### Migration Komutları

```bash
# Migration durumunu kontrol et
npx prisma migrate status

# Yeni migration oluştur
npx prisma migrate dev --name migration_name

# Production migration uygula
npx prisma migrate deploy

# Migration'ı geri al
npx prisma migrate reset

# Schema'ya göre migration oluştur
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma
```

## 🚨 Önemli Migration'lar

### 1. Multi-tenant Structure (20250716200939)

**Amaç**: Multi-tenant yapıya geçiş

**Değişiklikler**:
- Clinic modeli eklendi
- Tüm modellere clinicId alanı eklendi
- Foreign key constraint'ler eklendi

**Etkilenen Tablolar**:
- patients
- offers
- reminders
- notes
- settings
- support_tickets
- referral_sources

### 2. Support System (20250718212139)

**Amaç**: Destek sistemi modelleri eklendi

**Değişiklikler**:
- SupportTicket modeli
- SupportMessage modeli
- SupportCategory modeli
- SupportPriority modeli
- SupportStatus modeli

### 3. Analytics Models (20250718210613)

**Amaç**: Analitik ve log sistemi

**Değişiklikler**:
- ActivityLog modeli
- SystemLog modeli
- AnalyticsEvent modeli

## 🔧 PatientOffer clinicId Migration

### Sorun

**Migration**: `20250720211648_add_clinicid_to_patientoffer`

**Sorun**: PatientOffer tablosuna clinicId alanı required olarak eklendi ama mevcut veriler için default value yoktu.

### Çözüm

Migration'ı düzelttik:

```sql
-- PatientOffer migration with clinicId fix
CREATE TABLE "new_patient_offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,  -- Required field
    "assigned" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "patient_offers_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "patient_offers_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "patient_offers_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Insert existing data with clinicId from related offer
INSERT INTO "new_patient_offers" ("assigned", "createdAt", "id", "offerId", "patientId", "updatedAt", "visible", "clinicId") 
SELECT 
    po."assigned", 
    po."createdAt", 
    po."id", 
    po."offerId", 
    po."patientId", 
    po."updatedAt", 
    po."visible",
    o."clinicId"  -- Get clinicId from related offer
FROM "patient_offers" po
JOIN "offers" o ON po."offerId" = o."id";
```

### Neden Bu Çözüm?

1. **Veri Bütünlüğü**: Mevcut PatientOffer kayıtları için clinicId değeri sağlanıyor
2. **Multi-tenant Güvenlik**: Her PatientOffer kaydı doğru clinic'e atanıyor
3. **Foreign Key Constraint**: Referential integrity korunuyor

## 🏢 Multi-tenant Migration

### Genel Strateji

Multi-tenant yapıya geçiş aşamalı olarak yapıldı:

1. **Aşama 1**: Clinic modeli oluşturuldu
2. **Aşama 2**: Tüm modellere clinicId eklendi
3. **Aşama 3**: Foreign key constraint'ler eklendi
4. **Aşama 4**: Mevcut veriler için clinicId değerleri sağlandı

### Migration Sırası

```sql
-- 1. Clinic tablosu oluştur
CREATE TABLE "clinics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL UNIQUE,
    -- ... diğer alanlar
);

-- 2. Mevcut veriler için default clinic oluştur
INSERT INTO "clinics" ("id", "name", "subdomain") 
VALUES ('default-clinic', 'Default Clinic', 'default');

-- 3. Tüm tablolara clinicId ekle
ALTER TABLE "patients" ADD COLUMN "clinicId" TEXT NOT NULL DEFAULT 'default-clinic';
ALTER TABLE "offers" ADD COLUMN "clinicId" TEXT NOT NULL DEFAULT 'default-clinic';
-- ... diğer tablolar

-- 4. Foreign key constraint'ler ekle
ALTER TABLE "patients" ADD CONSTRAINT "patients_clinicId_fkey" 
    FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id");

-- 5. Default değerleri kaldır
ALTER TABLE "patients" ALTER COLUMN "clinicId" DROP DEFAULT;
```

## 🚀 Production Migration

### Pre-migration Checklist

- [ ] **Backup alındı** - Veritabanı yedeği
- [ ] **Test edildi** - Staging'de test edildi
- [ ] **Downtime planlandı** - Bakım penceresi
- [ ] **Rollback planı** - Geri alma stratejisi
- [ ] **Monitoring** - Migration sırasında takip

### Migration Komutları

```bash
# 1. Production'a bağlan
export DATABASE_URL="postgresql://..."

# 2. Migration durumunu kontrol et
npx prisma migrate status

# 3. Migration'ları uygula
npx prisma migrate deploy

# 4. Prisma client'ı güncelle
npx prisma generate

# 5. Seed data'yı yükle
npx prisma db seed
```

### Post-migration Checklist

- [ ] **Veri kontrolü** - Tüm veriler doğru
- [ ] **Performance testi** - Query performansı
- [ ] **Functionality testi** - Uygulama çalışıyor
- [ ] **Monitoring** - Hata yok
- [ ] **Backup** - Yeni yedek al

## 🔄 Rollback Stratejileri

### 1. Migration Rollback

```bash
# Migration'ı geri al
npx prisma migrate reset

# Belirli migration'a geri dön
npx prisma migrate resolve --rolled-back 20250720211648_add_clinicid_to_patientoffer
```

### 2. Manual Rollback

```sql
-- PatientOffer clinicId'yi kaldır
ALTER TABLE "patient_offers" DROP COLUMN "clinicId";

-- Foreign key constraint'i kaldır
ALTER TABLE "patient_offers" DROP CONSTRAINT "patient_offers_clinicId_fkey";
```

### 3. Data Recovery

```sql
-- Mevcut verileri geri yükle
INSERT INTO "patient_offers" ("id", "patientId", "offerId", "assigned", "visible", "createdAt", "updatedAt")
SELECT "id", "patientId", "offerId", "assigned", "visible", "createdAt", "updatedAt"
FROM "patient_offers_backup";
```

## 📊 Migration Monitoring

### Migration Logs

```sql
-- Migration geçmişini kontrol et
SELECT * FROM "_prisma_migrations" ORDER BY "started_at" DESC;

-- Başarısız migration'ları bul
SELECT * FROM "_prisma_migrations" WHERE "applied_steps_count" != "migration_steps_count";
```

### Performance Monitoring

```sql
-- Migration sonrası performans kontrolü
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Data Integrity Check

```sql
-- Foreign key constraint'leri kontrol et
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY';
```

## 🛠️ Migration Best Practices

### 1. Migration Naming

```bash
# İyi migration isimleri
npx prisma migrate dev --name "add_clinic_id_to_patient_offer"
npx prisma migrate dev --name "create_support_ticket_system"
npx prisma migrate dev --name "add_analytics_tables"

# Kötü migration isimleri
npx prisma migrate dev --name "update"
npx prisma migrate dev --name "fix"
npx prisma migrate dev --name "changes"
```

### 2. Migration Structure

```sql
-- Migration dosyası yapısı
/*
  Warnings:
  - Açıklama: Bu migration ne yapıyor
  - Uyarılar: Dikkat edilmesi gereken noktalar
*/

-- 1. Yeni tablolar oluştur
CREATE TABLE "new_table" (...);

-- 2. Mevcut verileri taşı
INSERT INTO "new_table" SELECT ... FROM "old_table";

-- 3. Eski tabloyu sil
DROP TABLE "old_table";

-- 4. Yeni tabloyu yeniden adlandır
ALTER TABLE "new_table" RENAME TO "table_name";

-- 5. Index'ler oluştur
CREATE INDEX "index_name" ON "table_name"("column");
```

### 3. Data Migration

```sql
-- Mevcut veriler için güvenli migration
-- 1. Yeni alanı nullable olarak ekle
ALTER TABLE "table" ADD COLUMN "new_field" TEXT;

-- 2. Mevcut verileri güncelle
UPDATE "table" SET "new_field" = "default_value" WHERE "new_field" IS NULL;

-- 3. Alanı required yap
ALTER TABLE "table" ALTER COLUMN "new_field" SET NOT NULL;
```

## 📚 Additional Resources

- [Prisma Migration Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Database Schema](./database-schema.md)
- [API Documentation](./api-documentation.md)
- [Deployment Guide](./deployment.md)

## 🤝 Support

Migration ile ilgili sorularınız için:
- **Email**: support@clinikoop.com
- **Documentation**: https://docs.clinikoop.com
- **GitHub Issues**: https://github.com/clinikoop/clinikoop/issues 