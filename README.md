# Clinikoop Projesi - Local ve Canlı Ortam Kurulum & Auth Ayarları

## 1. Local Geliştirme Ortamı

### .env.local Örneği
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=local-secret
COOKIE_SECURE=false
DOMAIN=localhost
DATABASE_URL="file:./prisma/dev.db"
```

- **COOKIE_SECURE=false**: Localde HTTPS zorunlu değildir, cookie'ler güvenli olmayan şekilde çalışır.
- **DOMAIN=localhost**: Localde domain/subdomain zorunlu değildir.
- **NEXTAUTH_URL**: Localde http://localhost:3000 olmalı.

### Localde Auth ve Login/Logout
- Geliştirici/test için minimum güvenlik.
- Giriş/çıkış işlemleri kolayca test edilebilir.
- Subdomain, HTTPS, secure cookie gibi zorunluluklar yoktur.

## 2. Canlı (Production) Ortam

### .env.production Örneği
```
NEXTAUTH_URL=https://app.sizinproje.com
NEXTAUTH_SECRET=canli-icin-gizli-bir-secret
COOKIE_SECURE=true
DOMAIN=sizinproje.com
DATABASE_URL="file:./prisma/prod.db"
```

- **COOKIE_SECURE=true**: Canlıda cookie'ler sadece HTTPS üzerinden, secure olarak çalışır.
- **DOMAIN=sizinproje.com**: Canlıda domain/subdomain zorunludur (örn. app.sizinproje.com, klinik1.sizinproje.com).
- **NEXTAUTH_URL**: Canlıda tam HTTPS URL olmalı.
- **NEXTAUTH_SECRET**: Canlıda güçlü, benzersiz bir secret kullanılmalı.

### Canlıya Geçişte Dikkat Edilecekler
- **HTTPS zorunlu**: Tüm trafik HTTPS üzerinden olmalı.
- **Secure Cookie**: `COOKIE_SECURE=true` olmalı.
- **Doğru domain/subdomain**: .env'de DOMAIN doğru ayarlanmalı.
- **Production secret**: NEXTAUTH_SECRET canlıya özel, güçlü ve kimseyle paylaşılmamalı.
- **Veritabanı**: Canlıda ayrı bir prod.db veya production veritabanı kullanılmalı.
- **.env dosyası**: Canlıya özel .env.production veya sunucu ortam değişkenleri kullanılmalı.

### Kodda Koşullu Ayar Örneği
```js
const isProduction = process.env.NODE_ENV === 'production';

cookie: {
  secure: process.env.COOKIE_SECURE === 'true',
  domain: isProduction ? process.env.DOMAIN : undefined,
  sameSite: isProduction ? 'strict' : 'lax',
}
```

## 3. Yedekleme ve Geri Yükleme
- Her büyük değişiklikten önce mutlaka veritabanı yedeği alın.
- Yedekler `backups/` klasöründe saklanmalı.
- Geri yükleme için ilgili .tar.gz dosyasını açıp `prisma/dev.db` dosyasını geri koyun.

## 4. Canlıya Geçişte Test Edilmesi Gerekenler
- Login/logout ve session yönetimi
- Rol bazlı erişim kontrolleri (süper admin, klinik admin, kullanıcı)
- Cookie ve session davranışı (secure, domain/subdomain, HTTPS)
- Klinik oluşturma, kullanıcı atama, yetki işlemleri
- Tüm kritik akışlar (hasta, teklif, not, randevu, vs.)

## 5. Ekstra Notlar
- Localde ve canlıda farklı .env dosyaları kullanın, asla canlı secret'ı localde paylaşmayın.
- Canlıya geçişten önce staging ortamında tam bir test yapın.
- Her zaman yedek alın, değişiklikleri küçük adımlarla ve test ederek ilerleyin.

---

**Bu rehber, projenin hem localde hem canlıda güvenli ve sorunsuz çalışması için hazırlanmıştır. Her adımda sorunuz olursa ekibe veya teknik desteğe danışın.** 

## NextAuth.js Kurulumu ve Ortam Notları

### Local Ortamda Çalıştırma
- NextAuth.js localde kurulu ve `/login`, `/logout` sayfaları layout’suz olarak tasarlandı.
- Cookie ve session ayarları localde `.env.local` dosyasında `NEXTAUTH_URL=http://localhost:3000` olarak ayarlanmalı.
- Subdomain desteği localde test için hosts dosyası veya özel proxy gerekebilir.

### Production (Canlı) Ortamda Dikkat Edilecekler
- `NEXTAUTH_URL` canlı domain/subdomain’e göre ayarlanmalı (örn: `https://klinik1.seninprojen.com`).
- `NEXTAUTH_SECRET` mutlaka güçlü bir şekilde tanımlanmalı.
- Subdomain bazlı oturum için NextAuth.js config’inde `cookies.domain` ayarı kullanılmalı. Örnek:
  ```js
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        domain: ".seninprojen.com",
        path: "/",
        sameSite: "lax",
        httpOnly: true,
        secure: true,
      },
    },
  }
  ```
- Canlıda HTTPS zorunlu, cookie ayarlarında `secure: true` olmalı.
- Kullanıcı ekleme/davet işlemleri sadece süper admin panelinden yapılmalı.
- Giriş ekranında klinik seçimi yok, subdomain üzerinden otomatik belirleniyor.

### Ekstra
- Geliştirici, canlıya geçişte bu notları ve NextAuth.js dökümantasyonunu mutlaka gözden geçirmeli.
- Ortam değişkenleri `.env.production` ve `.env.local` olarak ayrılmalı.
- Herhangi bir auth veya cookie problemi yaşanırsa, domain ve subdomain ayarları ilk kontrol edilmesi gereken yerlerdir. 

## Klinik Kullanıcısı (ClinicUser) Otomatik Oluşturma Notu

Hatırlatma (reminder) oluşturulurken ilgili kliniğe bağlı bir ClinicUser yoksa, backend otomatik olarak `admin@clinikoop.com` mailiyle bir admin kullanıcı oluşturur ve hatırlatma bu kullanıcıya bağlanır.

> **Not:** Bu geçici bir çözümdür, production ortamı için güvenli değildir. Gerçek ortamda kullanıcı yönetimi ve yetkilendirme mutlaka düzgün şekilde uygulanmalıdır. 