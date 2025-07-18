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

### Eski Yedekleri Temizle
```bash
# 30 günden eski yedekleri sil
find backups/ -name "*.tar.gz" -mtime +30 -delete
```

### Yedek Boyutunu Kontrol Et
```bash
du -sh backups/
```

## ⚠️ Önemli Notlar

1. **Environment Dosyası**: `.env` dosyası hassas bilgiler içerebilir
2. **Veritabanı**: SQLite dosyası büyük olabilir, düzenli temizlik yapın
3. **Git**: Her yedekleme öncesi commit yapın
4. **Test**: Geri yükleme işlemini test ortamında deneyin

## 🔄 Otomatik Yedekleme (Opsiyonel)

Cron job ile otomatik yedekleme:

```bash
# Crontab'a ekle (günde bir yedek)
0 2 * * * cd /path/to/clinikoop && ./backup.sh "otomatik_$(date +\%Y\%m\%d)"
```

## 📞 Sorun Giderme

### Yedekleme Hatası
- Disk alanı kontrol edin
- Dosya izinlerini kontrol edin
- rsync komutunun çalıştığından emin olun

### Geri Yükleme Hatası
- Yedek dosyasının bütünlüğünü kontrol edin
- Mevcut proje yedeğini kullanın
- Node.js ve npm versiyonlarını kontrol edin

### Veritabanı Sorunu
- Prisma migration'ları çalıştırın
- Veritabanı dosyasının izinlerini kontrol edin
- Schema değişikliklerini kontrol edin

## 📈 Yedekleme Performansı

- **Yedek Boyutu**: ~3-5MB (sıkıştırılmış)
- **Yedekleme Süresi**: ~30-60 saniye
- **Geri Yükleme Süresi**: ~2-5 dakika
- **Önerilen Sıklık**: Haftada 1-2 kez

---

**Son Güncelleme**: 16 Temmuz 2025
**Versiyon**: 1.0 