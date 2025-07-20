# 🚀 Vercel Deployment Rehberi

## ⚠️ KRİTİK NOTLAR

### Database Provider Değişikliği
- **Local Development**: SQLite kullanılır (`file:./prisma/dev.db`)
- **Production (Vercel)**: PostgreSQL kullanılır (`postgresql://...`)
- Prisma schema otomatik olarak production'da PostgreSQL'e geçer

### Build Hataları Çözümü
- `next.config.js`'de `output: 'standalone'` eklendi
- Prisma client build sırasında generate edilir
- Dynamic server usage hataları önlendi

## 📋 Ön Gereksinimler

### 1. PostgreSQL Database
- [Neon](https://neon.tech) (Önerilen - Vercel ile entegre)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- [PlanetScale](https://planetscale.com)

### 2. Vercel Hesabı
- [Vercel](https://vercel.com) hesabı oluşturun

## 🔧 Environment Variables

Vercel dashboard'da aşağıdaki environment variables'ları ekleyin:

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Development overrides (opsiyonel)
NODE_ENV="production"
```

### Environment Variables Açıklamaları:

#### `DATABASE_URL`
**ÖNEMLİ**: Production'da PostgreSQL connection string'i olmalı. Örnek format:
```
postgresql://username:password@host:port/database
```

#### `NEXTAUTH_URL`
Production domain'iniz. Örnek:
```
https://clinikoop.vercel.app
```

#### `NEXTAUTH_SECRET`
Güvenli bir secret key. Oluşturmak için:
```bash
openssl rand -base64 32
```

## 🚀 Deployment Adımları

### 1. GitHub'a Push
```bash
git add .
git commit -m "Vercel deployment hazırlığı - PostgreSQL support"
git push origin main
```

### 2. Vercel'de Import
1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "New Project" tıklayın
3. GitHub repository'nizi seçin
4. Framework Preset: **Next.js** seçin

### 3. Environment Variables Ekleme
1. Project Settings > Environment Variables
2. Yukarıdaki environment variables'ları ekleyin
3. Production, Preview, Development için işaretleyin

### 4. Build Settings
- **Build Command**: `npm run build` (otomatik Prisma generate ile)
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 5. Database Setup
1. PostgreSQL database oluşturun
2. Connection string'i `DATABASE_URL` olarak ekleyin
3. İlk deployment sonrası database migrate edin

## 🗄️ Database Migration

### Otomatik Migration (Önerilen)
Vercel'de "Deploy Hooks" kullanarak:

```bash
# Post-deploy script
npx prisma migrate deploy
npx prisma db seed
```

### Manuel Migration
```bash
# Local'de
npx prisma migrate deploy
npx prisma db seed

# Veya Vercel CLI ile
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

## 🔍 Troubleshooting

### 1. Build Hataları
```bash
# Local'de test edin
npm run build
```

### 2. Database Bağlantı Sorunları
- `DATABASE_URL` doğru PostgreSQL formatında mı?
- Database erişim izinleri var mı?
- SSL gerekiyor mu?

### 3. NextAuth Sorunları
- `NEXTAUTH_SECRET` set edilmiş mi?
- `NEXTAUTH_URL` doğru domain mi?

### 4. Prisma Sorunları
```bash
# Prisma client'ı yeniden generate edin
npx prisma generate
```

### 5. Yaygın Hatalar ve Çözümleri

#### "Error validating datasource: the URL must start with the protocol"
- **Çözüm**: `DATABASE_URL` PostgreSQL formatında olmalı
- **Örnek**: `postgresql://user:pass@host:port/db`

#### "Dynamic server usage" hataları
- **Çözüm**: `next.config.js`'de `output: 'standalone'` ayarı eklendi
- **Durum**: Bu hatalar artık build'i durdurmayacak

#### "PrismaClientInitializationError"
- **Çözüm**: Environment variables'ları kontrol edin
- **Durum**: Build sırasında Prisma client otomatik generate edilir

## 📊 Monitoring

### 1. Vercel Analytics
- Function execution times
- Error rates
- Performance metrics

### 2. Database Monitoring
- Connection pool usage
- Query performance
- Storage usage

## 🔒 Security

### 1. Environment Variables
- Production'da sensitive data'ları environment variables'da saklayın
- `.env` dosyalarını git'e commit etmeyin

### 2. Database Security
- Strong passwords kullanın
- IP whitelist uygulayın
- SSL connections zorunlu kılın

### 3. NextAuth Security
- Güçlü `NEXTAUTH_SECRET` kullanın
- HTTPS zorunlu kılın
- Session timeout ayarlayın

## 🚀 Production Checklist

- [ ] Environment variables set edildi
- [ ] PostgreSQL database hazır
- [ ] Database migration tamamlandı
- [ ] Seed data yüklendi
- [ ] SSL certificate aktif
- [ ] Custom domain ayarlandı
- [ ] Error monitoring aktif
- [ ] Performance monitoring aktif
- [ ] Backup strategy hazır
- [ ] Security headers ayarlandı

## 📞 Support

Sorun yaşarsanız:
1. Vercel logs kontrol edin
2. Database connection test edin
3. Environment variables kontrol edin
4. Build logs inceleyin

## 🔄 CI/CD

### GitHub Actions (Opsiyonel)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

**🎉 Başarılı deployment sonrası:**
- Admin paneli: `https://your-domain.vercel.app/admin`
- Klinik paneli: `https://your-domain.vercel.app/site`
- API endpoints: `https://your-domain.vercel.app/api/*` 