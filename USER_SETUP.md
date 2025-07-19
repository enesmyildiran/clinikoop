# Clinikoop - Kullanıcı Kurulum Rehberi

## 🚀 Hızlı Kurulum

Projenizi Vercel'de deploy ettikten sonra kullanıcı erişim sistemini kurmak için aşağıdaki adımları takip edin:

### 1. Tüm Kullanıcıları Tek Seferde Oluştur

```bash
npm run setup:users
```

Bu komut:
- ✅ Süper admin kullanıcısı oluşturur
- ✅ Test kliniği oluşturur
- ✅ 4 farklı rol için standart kullanıcılar oluşturur
- ✅ Tüm erişim bilgilerini gösterir

### 2. Ayrı Ayrı Kurulum (İsteğe Bağlı)

#### Sadece Süper Admin
```bash
npm run setup:super-admin
```

#### Sadece Standart Kullanıcılar
```bash
npm run setup:standard-users
```

## 📋 Oluşturulan Kullanıcılar

### 🔴 Süper Admin (Tüm sistemlere erişim)
- **Email:** `superadmin@clinikoop.com`
- **Şifre:** `superadmin123`
- **URL:** `https://yourdomain.com/admin`
- **Yetkiler:** Tüm sistemlere tam erişim

### 🔵 Klinik Kullanıcıları (Test kliniği)
- **Klinik:** Test Klinik
- **Subdomain:** `test`
- **URL:** `https://test.yourdomain.com`

#### Kullanıcı Listesi:
1. **Klinik Admin**
   - Email: `admin@test.com`
   - Şifre: `admin123`
   - Rol: `ADMIN`

2. **Doktor**
   - Email: `doctor@test.com`
   - Şifre: `doctor123`
   - Rol: `DOCTOR`

3. **Satış Temsilcisi**
   - Email: `sales@test.com`
   - Şifre: `sales123`
   - Rol: `SALES`

4. **Standart Kullanıcı**
   - Email: `user@test.com`
   - Şifre: `user123`
   - Rol: `USER`

## 🧪 Test Etme

### 1. Test Sayfası
Kullanıcı erişim sistemini test etmek için:
```
https://yourdomain.com/test-auth
```

Bu sayfa:
- ✅ Session bilgilerini gösterir
- ✅ Kullanıcı yetkilerini kontrol eder
- ✅ Klinik bilgilerini gösterir
- ✅ Erişim testleri sunar

### 2. Manuel Test
1. **Süper Admin Testi:**
   - `https://yourdomain.com/admin` adresine gidin
   - Süper admin bilgileriyle giriş yapın

2. **Klinik Kullanıcı Testi:**
   - `https://test.yourdomain.com` adresine gidin
   - Klinik kullanıcı bilgileriyle giriş yapın

3. **Yetkisiz Erişim Testi:**
   - `https://yourdomain.com/unauthorized` adresini ziyaret edin

## 🔒 Güvenlik Notları

### ⚠️ ÖNEMLİ: Canlı Ortamda Yapılması Gerekenler

1. **Şifre Değiştirme:**
   - Tüm test şifrelerini değiştirin
   - Güçlü şifreler kullanın
   - Şifre politikası belirleyin

2. **Environment Variables:**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your-strong-secret-here
   COOKIE_SECURE=true
   DOMAIN=yourdomain.com
   ```

3. **HTTPS Zorunluluğu:**
   - Canlıda tüm trafik HTTPS üzerinden olmalı
   - Cookie'ler secure olarak ayarlanmalı

4. **Test Kullanıcıları:**
   - Test kullanıcılarını canlıda devre dışı bırakın
   - Gerçek kullanıcılar oluşturun
   - Rol bazlı yetkilendirme uygulayın

## 🛠️ Geliştirme Modu

### Local Geliştirme
- Geliştirme modunda localhost otomatik süper admin yetkisi verir
- Login/logout olmadan test yapabilirsiniz
- `http://localhost:3000/test-auth` adresinden test edebilirsiniz

### Canlı Ortam
- Gerçek NextAuth sistemi devreye girer
- Session kontrolü yapılır
- Rol bazlı erişim kontrolleri aktif

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Test sayfasını kontrol edin: `/test-auth`
2. Console loglarını inceleyin
3. Environment variables'ları kontrol edin
4. Vercel deployment loglarını kontrol edin

---

**Bu rehber, projenizin hem localde hem canlıda güvenli ve sorunsuz çalışması için hazırlanmıştır.** 