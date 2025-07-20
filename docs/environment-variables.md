# 🔧 Environment Variables

Bu dokümantasyon, Clinikoop platformunun environment variables'larını ve konfigürasyonunu detaylı olarak açıklar.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Environment Variables Listesi](#environment-variables-listesi)
- [Development vs Production](#development-vs-production)
- [Environment Validation](#environment-validation)
- [Security Best Practices](#security-best-practices)
- [Vercel Deployment](#vercel-deployment)
- [Troubleshooting](#troubleshooting)

## 🌐 Genel Bakış

Clinikoop, farklı ortamlar için farklı environment variables kullanır:

- **Development**: Local development için
- **Production**: Vercel deployment için
- **Testing**: Test ortamı için

### Environment Dosyaları

```bash
# Development
.env.local          # Local development (gitignore)
.env.development    # Development specific

# Production
.env.production     # Production specific
.env.local          # Local overrides

# Testing
.env.test           # Test environment
```

## 🔧 Environment Variables Listesi

### 🔐 Zorunlu Environment Variables

#### 1. Database Configuration

```bash
# PostgreSQL Database URL
DATABASE_URL="postgresql://username:password@host:port/database"

# Örnekler:
# Local: postgresql://postgres:password@localhost:5432/clinikoop_dev
# Neon: postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/clinikoop
# Supabase: postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

**Açıklama**: Veritabanı bağlantı string'i. Production'da PostgreSQL olmalı.

#### 2. Authentication (NextAuth.js)

```bash
# NextAuth URL
NEXTAUTH_URL="https://your-domain.vercel.app"

# NextAuth Secret
NEXTAUTH_SECRET="your-super-secret-key-here"

# Örnekler:
# Development: http://localhost:3000
# Production: https://clinikoop.vercel.app
```

**Açıklama**: NextAuth.js konfigürasyonu için gerekli.

#### 3. Environment Type

```bash
# Environment Type
NODE_ENV="production"  # development, production, test
```

**Açıklama**: Uygulama ortamını belirler.

### 🔧 Opsiyonel Environment Variables

#### 4. Domain Configuration

```bash
# Main Domain (Multi-tenant)
NEXT_PUBLIC_MAIN_DOMAIN="clinikoop.com"

# Base URL
NEXT_PUBLIC_BASE_URL="https://clinikoop.vercel.app"
```

**Açıklama**: Multi-tenant subdomain routing için.

#### 5. Monitoring & Analytics

```bash
# Prometheus Metrics
PROMETHEUS_ENABLED="true"
PROMETHEUS_PORT="9090"

# Error Tracking
SENTRY_DSN="https://your-sentry-dsn.ingest.sentry.io/project"
```

**Açıklama**: Monitoring ve error tracking için.

#### 6. Email Configuration

```bash
# SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

**Açıklama**: Email gönderimi için (gelecek özellik).

#### 7. File Storage

```bash
# AWS S3 (gelecek özellik)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="clinikoop-files"
```

**Açıklama**: Dosya yükleme için (gelecek özellik).

## 🏗️ Development vs Production

### Development Environment

```bash
# .env.local (Development)
DATABASE_URL="postgresql://postgres:password@localhost:5432/clinikoop_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-development-secret-key"
NODE_ENV="development"
NEXT_PUBLIC_MAIN_DOMAIN="localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Özellikler**:
- Local PostgreSQL database
- Development mode
- Debug logging
- Hot reload
- Local domain

### Production Environment

```bash
# Vercel Environment Variables
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/clinikoop"
NEXTAUTH_URL="https://clinikoop.vercel.app"
NEXTAUTH_SECRET="production-super-secret-key-here"
NODE_ENV="production"
NEXT_PUBLIC_MAIN_DOMAIN="clinikoop.com"
NEXT_PUBLIC_BASE_URL="https://clinikoop.vercel.app"
PROMETHEUS_ENABLED="true"
```

**Özellikler**:
- Production PostgreSQL database
- Production mode
- Optimized build
- SSL/HTTPS
- Monitoring enabled

## ✅ Environment Validation

### Validation Script

```typescript
// lib/env-validation.ts
export function validateEnvironment() {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'NODE_ENV'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Database URL validation
  if (!process.env.DATABASE_URL?.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a PostgreSQL connection string');
  }

  // NEXTAUTH_SECRET validation
  if (process.env.NEXTAUTH_SECRET?.length < 32) {
    throw new Error('NEXTAUTH_SECRET must be at least 32 characters long');
  }

  return true;
}
```

### Usage

```typescript
// app/layout.tsx
import { validateEnvironment } from '@/lib/env-validation';

if (process.env.NODE_ENV === 'production') {
  validateEnvironment();
}
```

## 🔒 Security Best Practices

### 1. Environment Variables Security

```bash
# ✅ DOĞRU - Production'da güvenli
NEXTAUTH_SECRET="super-long-random-string-here"
DATABASE_URL="postgresql://user:pass@host:port/db"

# ❌ YANLIŞ - Güvenlik açığı
NEXTAUTH_SECRET="123456"
DATABASE_URL="postgresql://admin:admin@localhost/db"
```

### 2. Client-Side Variables

```bash
# ✅ GÜVENLİ - Client-side'da kullanılabilir
NEXT_PUBLIC_MAIN_DOMAIN="clinikoop.com"
NEXT_PUBLIC_BASE_URL="https://clinikoop.vercel.app"

# ❌ GÜVENSİZ - Client-side'da kullanılamaz
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
```

### 3. Secret Generation

```bash
# NEXTAUTH_SECRET oluştur
openssl rand -base64 32

# Veya Node.js ile
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Environment Variables Rotation

```bash
# Düzenli olarak secret'ları değiştir
# 1. Yeni secret oluştur
# 2. Environment variable güncelle
# 3. Uygulamayı yeniden deploy et
# 4. Eski secret'ı kaldır
```

## 🚀 Vercel Deployment

### Vercel Environment Variables Setup

1. **Vercel Dashboard** > Project Settings > Environment Variables
2. Aşağıdaki variables'ları ekleyin:

```bash
# Production
DATABASE_URL=postgresql://user:pass@host:port/db
NEXTAUTH_URL=https://clinikoop.vercel.app
NEXTAUTH_SECRET=your-production-secret
NODE_ENV=production
NEXT_PUBLIC_MAIN_DOMAIN=clinikoop.com
NEXT_PUBLIC_BASE_URL=https://clinikoop.vercel.app

# Preview (opsiyonel)
DATABASE_URL=postgresql://user:pass@host:port/db_preview
NEXTAUTH_URL=https://clinikoop-git-main.vercel.app
NEXTAUTH_SECRET=your-preview-secret
NODE_ENV=production
```

### Environment Variables Priority

1. **Vercel Environment Variables** (en yüksek)
2. **.env.production**
3. **.env.local**
4. **.env** (en düşük)

### Vercel CLI ile Environment Variables

```bash
# Environment variables'ları local'e çek
vercel env pull .env.local

# Environment variables'ları Vercel'e push
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

## 🔍 Troubleshooting

### 1. Environment Variables Kontrolü

```typescript
// api/test-env/route.ts
export async function GET() {
  return Response.json({
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not Set',
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not Set',
    mainDomain: process.env.NEXT_PUBLIC_MAIN_DOMAIN,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL
  });
}
```

### 2. Yaygın Hatalar ve Çözümleri

#### "DATABASE_URL is not set"
```bash
# Çözüm: Environment variable ekle
vercel env add DATABASE_URL postgresql://user:pass@host:port/db
```

#### "NEXTAUTH_SECRET is not set"
```bash
# Çözüm: Secret oluştur ve ekle
openssl rand -base64 32
vercel env add NEXTAUTH_SECRET "generated-secret"
```

#### "Invalid DATABASE_URL format"
```bash
# Çözüm: PostgreSQL formatında olmalı
# ❌ Yanlış: mysql://user:pass@host/db
# ✅ Doğru: postgresql://user:pass@host:port/db
```

#### "NEXTAUTH_URL mismatch"
```bash
# Çözüm: Doğru domain kullan
# Development: http://localhost:3000
# Production: https://clinikoop.vercel.app
```

### 3. Environment Variables Debug

```bash
# Local'de test et
npm run dev

# Production build test
npm run build

# Environment variables'ları kontrol et
node -e "console.log(process.env.NODE_ENV)"
node -e "console.log(process.env.DATABASE_URL ? 'Set' : 'Not Set')"
```

### 4. Database Connection Test

```typescript
// api/test-db/route.ts
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    await prisma.$disconnect();
    
    return Response.json({
      status: 'success',
      database: 'connected',
      test: result
    });
  } catch (error) {
    return Response.json({
      status: 'error',
      database: 'connection failed',
      error: error.message
    }, { status: 500 });
  }
}
```

## 📊 Environment Monitoring

### 1. Environment Variables Health Check

```typescript
// api/health/env/route.ts
export async function GET() {
  const envCheck = {
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: !!process.env.DATABASE_URL,
    nextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    mainDomain: process.env.NEXT_PUBLIC_MAIN_DOMAIN,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL
  };

  const missing = Object.entries(envCheck)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  return Response.json({
    status: missing.length === 0 ? 'healthy' : 'unhealthy',
    environment: envCheck,
    missing: missing
  });
}
```

### 2. Environment Variables Logging

```typescript
// lib/logger.ts
export function logEnvironment() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment Variables:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not Set');
    console.log('- NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    console.log('- NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Not Set');
  }
}
```

## 📋 Environment Variables Checklist

### Development Setup
- [ ] `.env.local` dosyası oluşturuldu
- [ ] `DATABASE_URL` PostgreSQL formatında
- [ ] `NEXTAUTH_URL` localhost:3000
- [ ] `NEXTAUTH_SECRET` güvenli secret
- [ ] `NODE_ENV` development
- [ ] Database bağlantısı test edildi

### Production Setup
- [ ] Vercel environment variables eklendi
- [ ] `DATABASE_URL` production PostgreSQL
- [ ] `NEXTAUTH_URL` production domain
- [ ] `NEXTAUTH_SECRET` güvenli production secret
- [ ] `NODE_ENV` production
- [ ] SSL certificate aktif
- [ ] Environment validation çalışıyor
- [ ] Health check başarılı

### Security Checklist
- [ ] Sensitive data environment variables'da
- [ ] `.env` dosyaları gitignore'da
- [ ] Client-side variables `NEXT_PUBLIC_` prefix'li
- [ ] Secrets güvenli ve uzun
- [ ] Environment variables rotation planı
- [ ] Access logs aktif

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Prisma Environment Variables](https://www.prisma.io/docs/concepts/components/prisma-client/initialization)

## 🤝 Support

Environment variables ile ilgili sorularınız için:
- **Email**: support@clinikoop.com
- **Documentation**: https://docs.clinikoop.com
- **GitHub Issues**: https://github.com/clinikoop/clinikoop/issues 