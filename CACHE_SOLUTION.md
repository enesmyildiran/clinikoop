# 🧹 Cache Sorunu Çözümü

Yeni tanıtım sitesi görünmüyor mu? Bu adımları takip edin:

## 🔄 Adım 1: Tarayıcı Cache'ini Temizleyin

### Chrome/Edge:
1. `Ctrl + Shift + R` (Windows) veya `Cmd + Shift + R` (Mac) - Hard Refresh
2. Veya `F12` → Network sekmesi → "Disable cache" işaretleyin
3. Veya `Ctrl + Shift + Delete` → "Cached images and files" seçin

### Firefox:
1. `Ctrl + F5` (Windows) veya `Cmd + Shift + R` (Mac)
2. Veya `Ctrl + Shift + Delete` → "Cache" seçin

### Safari:
1. `Cmd + Option + R` - Hard Refresh
2. Veya Develop → Empty Caches

## 🛠️ Adım 2: Development Sunucusunu Yeniden Başlatın

```bash
# Sunucuyu durdurun (Ctrl + C)
# Sonra yeniden başlatın:
npm run dev
```

## 🧹 Adım 3: Next.js Cache'ini Temizleyin

```bash
# Cache temizleme scriptini çalıştırın:
node clear-cache.js

# Veya manuel olarak:
rm -rf .next
npm run dev
```

## 🌐 Adım 4: Tarayıcıda Kontrol Edin

1. `http://localhost:3000` adresine gidin
2. Yeni tanıtım sitesi görünmelidir
3. Eğer hala eski tasarım görünüyorsa, tarayıcıyı tamamen kapatıp açın

## 📱 Mobil Cihazlarda Test

Eğer mobil cihazda test ediyorsanız:
1. Bilgisayarınızın IP adresini öğrenin: `ifconfig` (Mac) veya `ipconfig` (Windows)
2. `http://[IP_ADRESI]:3000` adresine gidin
3. Aynı Wi-Fi ağında olduğunuzdan emin olun

## 🔍 Sorun Devam Ederse

1. Farklı bir tarayıcı deneyin
2. Gizli/İnkognito modda test edin
3. Tarayıcı eklentilerini geçici olarak devre dışı bırakın

## ✅ Başarılı!

Yeni tanıtım sitesi şu özelliklere sahip:
- Modern, responsive tasarım
- Hero section ile öne çıkan mesajlar
- Özellikler bölümü
- Fiyatlandırma planları
- Hakkımızda ve iletişim bölümleri
- Footer ile tam sayfa yapısı 