# 📚 Clinikoop Dokümantasyonu

Bu klasör, Clinikoop platformunun tüm modüllerinin detaylı dokümantasyonunu içerir.

## 📦 Versiyon Bilgisi

**Güncel Versiyon**: `0.2.0`  
**Son Güncelleme**: 2024-01-XX  
**Durum**: Production Ready

### 🆕 Bu Versiyonda Neler Yeni?

- ✅ **Role-Based Routing**: Middleware ile güvenli route koruması
- ✅ **Permission System**: Context-based izin yönetimi
- ✅ **Rate Limiting**: Login güvenliği
- ✅ **Audit Logging**: Kullanıcı aktivite takibi
- ✅ **Vercel Optimization**: Production deployment hazırlığı

[📋 Detaylı Changelog](../CHANGELOG.md)

## 📋 İçindekiler

### 🏥 Temel Modüller
- [**Hasta Modülü**](./patient-module.md) - Hasta kayıt ve yönetim sistemi
- [**Teklif Modülü**](./offer-module.md) - Tedavi teklifleri ve PDF oluşturma
- [**Hatırlatma Modülü**](./reminder-module.md) - Hasta ve teklif takibi
- [**Raporlama Modülü**](./reporting-module.md) - Analiz ve performans raporları

### 🔧 Yönetim Modülleri
- [**Admin Modülü**](./admin-module.md) - Merkezi yönetim paneli
- [**Destek Modülü**](./support-module.md) - Ticket tabanlı destek sistemi
- [**Kullanıcı Modülü**](./user-module.md) - Kullanıcı yönetimi ve yetkilendirme

### 🛠️ Teknik Modüller
- [**API Dokümantasyonu**](./api-documentation.md) - Tüm API endpoint'leri ✅
- [**Database Schema**](./database-schema.md) - Veritabanı yapısı ve ilişkiler ✅
- [**Environment Variables**](./environment-variables.md) - Environment variables ve konfigürasyon ✅
- [**Authentication**](./authentication.md) - Kimlik doğrulama ve yetkilendirme ✅
- [**Admin Module**](./admin-module.md) - Admin paneli ve sistem yönetimi ✅
- [**Deployment**](./deployment.md) - Vercel deployment rehberi ✅

### 📋 Proje Yönetimi
- [**TODO - Düzeltilmesi Gerekenler**](./TODO.md) - İleride kesinlikle düzeltilmesi gereken notlar 🚨

## 🎯 Modül Özellikleri

Her modül dokümantasyonu şu bölümleri içerir:

### 📖 İçerik Yapısı
- **Genel Bakış** - Modülün amacı ve kapsamı
- **Özellikler** - Ana özellikler listesi
- **API Endpoint'leri** - Tüm API route'ları
- **Database Modelleri** - İlgili Prisma modelleri
- **UI Bileşenleri** - React component'leri
- **Kullanım Örnekleri** - Pratik kullanım senaryoları
- **Troubleshooting** - Yaygın sorunlar ve çözümler

### 🔍 Kontrol Listeleri
- **Geliştirme Kontrolü** - Geliştirme sırasında kontrol edilecek noktalar
- **Test Kontrolü** - Test edilmesi gereken senaryolar
- **Deployment Kontrolü** - Production'a çıkmadan önce kontrol listesi

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler
- Node.js 18+ 
- PostgreSQL (local veya cloud)
- Git

### ⚠️ Önemli Güvenlik Notları

#### Authentication Güvenliği
- **Admin girişi ayrı** - `/admin-login` sadece süper admin için
- **Klinik girişi ayrı** - `/login` klinik kullanıcıları için
- **Environment variables** - Şifreler `.env.local` dosyasında
- **Session timeout** - 8 saat (güvenlik için kısaltıldı)
- **Audit logging** - Tüm login/logout işlemleri loglanır

#### Development vs Production
```bash
# Development (.env.local)
SUPER_ADMIN_PASSWORD="admin123"  # Basit şifre (development)
SESSION_MAX_AGE="28800"          # 8 saat

# Production (.env)
SUPER_ADMIN_PASSWORD="güçlü-şifre-buraya"  # Güçlü şifre
SESSION_MAX_AGE="14400"                    # 4 saat
RATE_LIMIT_MAX_REQUESTS="3"                # 3 deneme
```

#### Test Kullanıcıları
```bash
# Admin Girişi (/admin-login)
Email: admin@test.com
Şifre: admin123 (veya .env'deki SUPER_ADMIN_PASSWORD)

# Klinik Girişi (/login)
Email: clinic@test.com  
Şifre: clinic123
```

### Başlangıç Adımları
1. **Hangi modülü öğrenmek istiyorsunuz?**
2. **İlgili dokümantasyonu okuyun**
3. **Kontrol listelerini takip edin**
4. **Örnekleri uygulayın**

## 📝 Dokümantasyon Güncelleme

Bu dokümantasyon sürekli güncellenmektedir. Yeni özellikler eklendiğinde:

1. İlgili modül dokümantasyonunu güncelleyin
2. API endpoint'lerini ekleyin
3. Örnekleri güncelleyin
4. Kontrol listelerini revize edin

## 🤝 Katkıda Bulunma

Dokümantasyona katkıda bulunmak için:

1. **Issue açın** - Eksik veya hatalı bilgi için
2. **Pull Request gönderin** - Düzeltme veya ekleme için
3. **Örnek ekleyin** - Kullanım örnekleri için

---

**Son Güncelleme**: 2024-01-XX
**Versiyon**: 1.0.0 