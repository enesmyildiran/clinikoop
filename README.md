# Clinikoop Subdomain - Multi-Tenant Platform

Bu proje, subdomain tabanlı multi-tenant routing kullanan bir Next.js uygulamasıdır. Her subdomain farklı bir kliniği temsil eder.

## 🚀 Özellikler

- **Subdomain Tabanlı Routing**: Her subdomain farklı bir kliniği temsil eder
- **Multi-Tenant**: Her klinik için ayrı içerik ve stil
- **TypeScript**: Tam tip güvenliği
- **Tailwind CSS**: Modern ve responsive tasarım
- **Vercel Ready**: Doğrudan Vercel'de deploy edilebilir

## 📋 Mevcut Subdomain'ler

- `test1` - Test Klinik 1 (Mavi tema)
- `test2` - Test Klinik 2 (Yeşil tema)
- `test3` - Test Klinik 3 (Mor tema)
- `default` - Bilinmeyen subdomain'ler için varsayılan

## 🛠️ Teknoloji Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Middleware**: Next.js Middleware

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Production sunucusunu başlat
npm start
```

## 🌐 Subdomain Test Etme

### Localhost'ta Test

1. `/etc/hosts` dosyasını düzenleyin (macOS/Linux):
```bash
sudo nano /etc/hosts
```

2. Aşağıdaki satırları ekleyin:
```
127.0.0.1 test1.localhost
127.0.0.1 test2.localhost
127.0.0.1 test3.localhost
```

3. Tarayıcıda test edin:
- http://test1.localhost:3000
- http://test2.localhost:3000
- http://test3.localhost:3000

### Production'ta Test

Vercel'de deploy ettikten sonra:
- https://test1.yourdomain.com
- https://test2.yourdomain.com
- https://test3.yourdomain.com

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── layout.tsx          # Ana layout
│   ├── page.tsx           # Ana sayfa (subdomain'e göre içerik)
│   └── globals.css        # Global stiller
├── lib/
│   └── clinics.ts         # Klinik verileri ve yardımcı fonksiyonlar
└── middleware.ts          # Subdomain routing middleware
```

## 🔧 Middleware Çalışma Mantığı

1. **Subdomain Tespiti**: Hostname'den subdomain çıkarılır
2. **Query Param Ekleme**: `clinic` query parametresi eklenir
3. **URL Rewrite**: URL yeniden yazılır ama kullanıcıya gösterilmez

### Örnek:
- **Gelen URL**: `test1.yourdomain.com`
- **İşlenmiş URL**: `test1.yourdomain.com?clinic=test1`
- **Kullanıcı Görünen URL**: `test1.yourdomain.com`

## 🎨 Klinik Özelleştirme

Her klinik için aşağıdaki özellikler tanımlanabilir:

```typescript
interface Clinic {
  id: string
  name: string
  description: string
  subdomain: string
  primaryColor?: string
  address?: string
  phone?: string
  email?: string
}
```

## 🚀 Vercel Deployment

1. **GitHub'a Push**: Projeyi GitHub'a yükleyin
2. **Vercel'e Import**: Vercel dashboard'dan projeyi import edin
3. **Domain Ayarları**: Custom domain ve subdomain'leri ayarlayın
4. **Deploy**: Otomatik deploy başlayacak

### Vercel Domain Ayarları

Vercel dashboard'da:
1. **Settings** > **Domains**
2. Ana domain'i ekleyin (örn: `yourdomain.com`)
3. Subdomain'leri ekleyin:
   - `test1.yourdomain.com`
   - `test2.yourdomain.com`
   - `test3.yourdomain.com`

## 🔍 Debug ve Test

### Middleware Debug

```typescript
// middleware.ts'de debug log'ları ekleyin
console.log('Hostname:', hostname)
console.log('Subdomain:', extractedSubdomain)
console.log('URL:', url.toString())
```

### Klinik Verilerini Test Etme

```typescript
import { getClinicBySubdomain, getAllClinics } from '@/lib/clinics'

// Belirli bir subdomain için klinik bilgisi
const clinic = getClinicBySubdomain('test1')

// Tüm klinikleri listele
const allClinics = getAllClinics()
```

## 📝 Geliştirme Notları

### Yeni Subdomain Ekleme

1. `src/lib/clinics.ts` dosyasına yeni klinik ekleyin
2. Gerekirse middleware'i güncelleyin
3. Test edin

### Stil Özelleştirme

Her klinik için farklı renkler ve stiller:
- `primaryColor`: Ana tema rengi
- Tailwind CSS ile responsive tasarım
- CSS-in-JS ile dinamik stiller

## 🐛 Bilinen Sorunlar

- Localhost'ta subdomain test etmek için `/etc/hosts` düzenlemesi gerekli
- Vercel'de custom domain ayarları manuel yapılmalı

## 📞 Destek

Sorunlar için GitHub Issues kullanın veya iletişime geçin.

## 📄 Lisans

MIT License 