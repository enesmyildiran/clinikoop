# Clinikoop - Geliştirme Modu Auth Sistemi

## 🚀 Geliştirme Modu Nedir?

Geliştirme modu, localhost'ta çalışırken login/logout olmadan da rol bazlı erişim test edebilmenizi sağlayan bir sistemdir. Bu sayede:

- ✅ Login/logout olmadan test yapabilirsiniz
- ✅ Rol bazlı erişim kontrollerini test edebilirsiniz
- ✅ Menü dinamikliğini test edebilirsiniz
- ✅ Canlıya alınca gerçek NextAuth sistemi devreye girer

## 🔧 Nasıl Çalışır?

### 1. Geliştirme Modunda (localhost)
- `NODE_ENV=development` ve `localhost` ise otomatik süper admin yetkileri
- `/api/auth/me` endpoint'i mock session döndürür
- Frontend'de "Geliştirme Modu" göstergesi görünür

### 2. Production Modunda (canlı)
- Gerçek NextAuth sistemi devreye girer
- Login/logout işlemleri normal çalışır
- Geliştirme modu göstergesi görünmez

## 📁 Değiştirilen Dosyalar

### Backend
- `src/app/api/auth/me/route.ts` - Mock session sistemi
- `src/lib/authOptions.ts` - NextAuth konfigürasyonu (değişmedi)

### Frontend
- `src/hooks/useAuth.ts` - `isDevelopment` bilgisi eklendi
- `src/components/Sidebar.tsx` - Geliştirme modu göstergesi
- `src/components/Header.tsx` - Geliştirme modu göstergesi
- `src/app/dashboard/page.tsx` - Test sayfası

## 🎯 Kullanım

### Geliştirme Modunda Test
1. `npm run dev` ile projeyi başlatın
2. `http://localhost:3000` adresine gidin
3. Otomatik olarak süper admin yetkileriyle giriş yapılmış olacak
4. Sidebar ve Header'da "Geliştirme Modu" göstergesi görünecek
5. Dashboard'da detaylı auth bilgileri görünecek

### Canlıya Alma
1. `NODE_ENV=production` olarak ayarlayın
2. Gerçek NextAuth sistemi devreye girer
3. Login/logout işlemleri normal çalışır
4. Geliştirme modu göstergeleri kaybolur

## 🔒 Güvenlik

### Geliştirme Modunda
- Sadece `localhost` ve `127.0.0.1` adreslerinde çalışır
- `NODE_ENV=development` kontrolü yapılır
- Süper admin yetkileri otomatik verilir

### Production Modunda
- Gerçek NextAuth sistemi kullanılır
- Session kontrolü yapılır
- Rol bazlı erişim kontrolleri aktif

## 🛠️ Teknik Detaylar

### Mock Session Yapısı
```typescript
{
  user: {
    id: string,
    email: string,
    name: string,
    role: string,
    clinicId: string | null
  },
  clinic: Clinic | null,
  isSuperAdmin: boolean,
  isDevelopment: true // Sadece geliştirme modunda
}
```

### useAuth Hook
```typescript
const { 
  user, 
  clinic, 
  isSuperAdmin, 
  isDevelopment, // Yeni eklenen
  isLoading, 
  error 
} = useAuth()
```

## 🚨 Önemli Notlar

1. **Geliştirme modu sadece localhost'ta çalışır**
2. **Canlıya alırken `NODE_ENV=production` olmalı**
3. **Gerçek kullanıcı verileri geliştirme modunda kullanılmaz**
4. **Session bilgileri geliştirme modunda mock'tur**

## 🔄 Gelecek Geliştirmeler

- [ ] Farklı roller için test kullanıcıları
- [ ] Klinik bazlı test senaryoları
- [ ] Otomatik test verisi oluşturma
- [ ] Geliştirme modu ayarları paneli

---

**Bu sistem sayesinde geliştirme sürecinde login/logout olmadan da tüm özellikleri test edebilir, canlıya alınca da gerçek auth sistemi sorunsuz çalışır.** 