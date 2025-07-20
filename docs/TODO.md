# 📋 TODO - İleride Düzeltilmesi Gerekenler

Bu dokümantasyon, Clinikoop projesinde ileride kesinlikle düzeltilmesi gereken önemli notları içerir.

## 🚨 KRİTİK - MUTLAKA DÜZELTİLMELİ

### 1. React Hook Dependency Uyarıları

**Durum:** Geçici olarak ESLint'te kapatıldı  
**Öncelik:** YÜKSEK  
**Etkilenen Dosyalar:** 15 dosya

#### ❌ Mevcut Durum:
```json
// .eslintrc.json
"react-hooks/exhaustive-deps": "off"  // GEÇİCİ ÇÖZÜM
```

#### ✅ Düzeltilmesi Gereken Dosyalar:
- `src/app/admin/clinics/[id]/edit/page.tsx` - Line 54
- `src/app/admin/clinics/[id]/page.tsx` - Line 54  
- `src/app/admin/support/[id]/page.tsx` - Line 48
- `src/app/offer/[slug]/page.tsx` - Line 150
- `src/app/site/offers/[id]/edit/page.tsx` - Line 48
- `src/app/site/offers/new/page.tsx` - Line 358
- `src/app/site/reminders/page.tsx` - Line 45
- `src/app/site/support/[id]/page.tsx` - Line 44
- `src/app/site/support/new/page.tsx` - Line 45
- `src/app/site/support/page.tsx` - Line 26
- `src/app/site/users/profile/page.tsx` - Line 29
- `src/components/ExchangeRateManager.tsx` - Line 86
- `src/components/ui/Toast.tsx` - Line 43
- `src/components/ui/ToothPricingInput.tsx` - Line 125
- `src/contexts/ReminderContext.tsx` - Line 209

#### 🔧 Düzeltme Yöntemi:
```typescript
// ❌ YANLIŞ
useEffect(() => {
  fetchData()
}, []) // fetchData eksik

// ✅ DOĞRU
const fetchData = useCallback(async () => {
  // fetch logic
}, [dependencies])

useEffect(() => {
  fetchData()
}, [fetchData]) // fetchData dependency olarak eklendi
```

### 2. Analytics Page Yeniden Oluşturulması

**Durum:** Geçici olarak silindi  
**Öncelik:** YÜKSEK  
**Dosya:** `src/app/admin/analytics/page.tsx`

#### ❌ Mevcut Durum:
```bash
# Dosya geçici olarak silindi
src/app/admin/analytics/page.tsx.disabled
```

#### 🔍 Sorun:
```typescript
// Çift fetchMetrics tanımı vardı
const fetchMetrics = useCallback(async () => { ... }, [selectedTimeRange])  // 1. tanım
const fetchMetrics = async () => { ... }  // 2. tanım - HATA!
```

#### ✅ Düzeltme Planı:
1. Dosyayı yeniden oluştur
2. useCallback ile fetchMetrics tanımla
3. useEffect dependency array'ini düzelt
4. Build test et

## ⚠️ ORTA ÖNCELİK - PERFORMANCE İÇİN ÖNEMLİ

### 3. Image Optimization

**Durum:** ESLint uyarısı açık  
**Öncelik:** ORTA  
**Etkilenen Dosyalar:** 3 dosya

#### ❌ Mevcut Durum:
```tsx
// src/components/ui/PDFEditorCanvas.tsx - Line 37
// src/components/ui/PDFTemplateEditor.tsx - Line 760, 769
// src/components/ui/PhoneInput.tsx - Line 143

<img src="/logo.png" alt="Logo" />  // ❌ ESLint uyarısı
```

#### ✅ Düzeltme:
```tsx
import Image from 'next/image'

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={100} 
  height={100}
  priority={false}
/>  // ✅ ESLint uyarısı yok
```

#### 📊 Performance Etkisi:
- **LCP (Largest Contentful Paint)** iyileşir
- **Bandwidth** tasarrufu
- **SEO** skoru artar

### 4. Accessibility (Alt Text)

**Durum:** ESLint uyarısı açık  
**Öncelik:** ORTA  
**Etkilenen Dosyalar:** 2 dosya

#### ❌ Mevcut Durum:
```tsx
// src/components/ui/PDFEditorToolbar.tsx - Line 111
// src/components/ui/PDFTemplateEditor.tsx - Line 662

<img src="/icon.png" />  // ❌ Alt text eksik
```

#### ✅ Düzeltme:
```tsx
<img src="/icon.png" alt="Icon description" />  // ✅ Açıklayıcı alt text
<img src="/icon.png" alt="" />  // ✅ Decorative image için boş alt
```

#### 🎯 Accessibility Etkisi:
- **Screen reader** desteği
- **WCAG** uyumluluğu
- **Kullanıcı deneyimi** iyileşir

## 📅 DÜZELTME TAKVİMİ

### Faz 1 - Kritik (1-2 hafta)
- [ ] React Hook dependency uyarıları düzelt
- [ ] Analytics page yeniden oluştur
- [ ] ESLint rule'u tekrar aç: `"react-hooks/exhaustive-deps": "warn"`

### Faz 2 - Orta Öncelik (2-4 hafta)
- [ ] Image optimization düzelt
- [ ] Accessibility alt text düzelt
- [ ] Performance test et

### Faz 3 - Test ve Doğrulama (1 hafta)
- [ ] Tüm ESLint uyarıları kontrol et
- [ ] Build test et
- [ ] Performance test et
- [ ] Accessibility test et

## 🔧 DÜZELTME KOMUTLARI

### React Hook Dependencies Düzeltme:
```bash
# ESLint rule'u tekrar aç
# .eslintrc.json'da:
"react-hooks/exhaustive-deps": "warn"

# Linter çalıştır
npm run lint

# Her dosyayı tek tek düzelt
```

### Analytics Page Yeniden Oluşturma:
```bash
# Yedek dosyayı geri yükle
cp src/app/admin/analytics/page.tsx.disabled src/app/admin/analytics/page.tsx

# Dosyayı düzelt
# useCallback ve useEffect dependency array'ini düzelt

# Build test et
npm run build
```

### Image Optimization:
```bash
# Her dosyada <img> tag'lerini <Image> ile değiştir
# width, height, alt prop'larını ekle

# Performance test et
npm run build
```

## 📊 ÖNCELİK MATRİSİ

| Öncelik | Açıklama | Etki | Süre |
|---------|----------|------|------|
| **YÜKSEK** | React Hook Dependencies | Build hataları, memory leaks | 1-2 hafta |
| **YÜKSEK** | Analytics Page | Admin paneli eksik | 1 hafta |
| **ORTA** | Image Optimization | Performance, SEO | 2-4 hafta |
| **ORTA** | Accessibility | UX, WCAG uyumluluğu | 2-4 hafta |

## 🎯 BAŞARI KRİTERLERİ

### ✅ Tamamlandı Sayılması İçin:
- [ ] Tüm React Hook dependency uyarıları düzeltildi
- [ ] Analytics page çalışır durumda
- [ ] ESLint'te hiç uyarı yok
- [ ] Build başarılı
- [ ] Performance testleri geçti
- [ ] Accessibility testleri geçti

## 📝 NOTLAR

### Önemli Hatırlatmalar:
- **React Hook dependencies** memory leak'e neden olabilir
- **Image optimization** SEO ve performance için kritik
- **Accessibility** yasal zorunluluk olabilir
- **Analytics page** admin paneli için gerekli

### Düzeltme Sırasında Dikkat:
- Her değişiklikten sonra build test et
- ESLint uyarılarını kontrol et
- Performance testleri yap
- Accessibility testleri yap

---

**Son Güncelleme:** 2024-01-XX  
**Güncelleyen:** Development Team  
**Durum:** Aktif - Düzeltme Bekliyor 