# Clinikoop Proje Yedekleme Sistemi

Bu dokümantasyon, Clinikoop projesinin yedekleme ve geri yükleme işlemlerini açıklar.

## 📋 Yedekleme Stratejisi

### 1. Git ile Versiyon Kontrolü
- Tüm kod değişiklikleri Git ile takip edilir
- Her önemli değişiklik için commit yapılır
- Remote repository (GitHub/GitLab) ile uzak yedekleme

### 2. Manuel Yedekleme
- Proje dosyaları + veritabanı tam yedeği
- Sıkıştırılmış format (.tar.gz)
- Tarih damgalı yedek isimlendirme

### 3. Otomatik Yedekleme
- `backup.sh` scripti ile otomatik yedekleme
- Kapsamlı proje durumu kaydı
- Geri yükleme talimatları dahil

## 🚀 Kullanım

### Yedek Alma

```bash
# Basit yedek alma
./backup.sh

# İsimli yedek alma
./backup.sh "önemli_özellik"

# Örnek
./backup.sh "pdf_editor_güncellemesi"
```

### Yedek Geri Yükleme

```bash
# Klasör yedekten geri yükleme
./restore.sh backups/clinikoop_backup_20250716_225642

# Sıkıştırılmış yedekten geri yükleme
./restore.sh clinikoop_backup_20250716_225642.tar.gz
```

## 📁 Yedek İçeriği

Her yedek şunları içerir:

- **Veritabanı**: `database.db` (SQLite)
- **Proje Dosyaları**: Tüm kaynak kodlar
- **Bağımlılıklar**: `package.json` ve `package-lock.json`
- **Environment**: `.env` dosyası
- **Prisma**: Schema ve migration dosyaları
- **Rapor**: `backup_info.txt` (yedekleme detayları)

## 🔧 Yedekleme Öncesi Kontroller

1. **Git durumu temiz mi?**
   ```bash
   git status
   ```

2. **Uygulama çalışıyor mu?**
   ```bash
   npm run dev
   ```

3. **Veritabanı bağlantısı çalışıyor mu?**
   - Dashboard sayfasını kontrol et
   - Hasta/teklif listelerini kontrol et

## 🛠️ Geri Yükleme Sonrası Kontroller

1. **Bağımlılıklar yüklendi mi?**
   ```bash
   npm install
   ```

2. **Prisma client güncel mi?**
   ```bash
   npx prisma generate
   ```

3. **Uygulama çalışıyor mu?**
   ```bash
   npm run dev
   ```

4. **Veritabanı bağlantısı çalışıyor mu?**
   - Ana sayfayı kontrol et
   - Veritabanı tablolarını kontrol et

## 📊 Yedek Yönetimi

### Yedekleri Listele
```bash
ls -la backups/
```

## 🔄 Son Güncellemeler (2025-01-17)

### Admin Panel Güncellemeleri
- **PDF Şablonları Menüden Kaldırıldı**: Admin sidebar'dan PDF şablonları menü öğesi kaldırıldı
- **Modül Ayarlarına PDF Section'ı Eklendi**: PDF ayarları için hazır tab eklendi
- **Admin Dashboard Modern Tasarımla Güncellendi**: 
  - Yönetim modülleri kartları eklendi
  - Modern istatistik kartları
  - Hover efektleri ve animasyonlar
  - Responsive tasarım

### Destek Sistemi Düzeltmeleri
- **Multi-tenant Yapı Korundu**: SupportCategory ve SupportPriority modellerinde clinicId alanı zorunlu kaldı
- **API Route Güvenliği**: Session kontrolü ve clinic ID yönetimi eklendi
- **Doğru Çözüm**: Her klinik kendi destek kategorilerini yönetebiliyor

### Yapılan Düzeltmeler
1. **Prisma Schema**: clinicId alanı zorunlu kaldı (multi-tenant yapı korundu)
2. **API Route Güvenliği**: Session kontrolü ve clinic ID yönetimi eklendi
3. **Multi-tenant Uyumluluğu**: Her klinik kendi destek kategorilerini yönetebiliyor

### Başarılı Çözüm
- Destek sistemi artık multi-tenant yapıya uygun
- Admin panelinde clinic ID yönetimi çalışıyor
- Production'a hazır

## 🚨 Bilinen Sorunlar

### Destek Sistemi
- [x] SupportCategory ve SupportPriority clinicId sorunu çözüldü
- [x] API route'larında session kontrolü eklendi
- [x] Multi-tenant yapıya uygun hale getirildi

### Admin Panel
- [ ] Clinic ID yönetimi eksik
- [ ] PDF ayarları section'ı boş
- [ ] Destek sistemi admin entegrasyonu eksik

## 📝 Gelecek Güncellemeler

### Planlanan İyileştirmeler
1. **Multi-tenant Destek Sistemi**: Her klinik kendi kategorilerini yönetebilsin
2. **PDF Ayarları**: Modül ayarları içinde PDF yönetimi
3. **Admin Dashboard**: Gerçek verilerle istatistikler
4. **Güvenlik**: Session kontrolü ve yetki yönetimi

### Öncelik Sırası
1. Prisma schema düzeltmesi
2. API route güvenliği
3. Multi-tenant uyumluluğu
4. Admin panel tamamlama 