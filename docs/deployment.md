# 🚀 Deployment Rehberi

Bu dokümantasyon, Clinikoop platformunun farklı ortamlara deployment süreçlerini detaylı olarak açıklar.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Environment Types](#environment-types)
- [Vercel Deployment](#vercel-deployment)
- [Database Deployment](#database-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Analytics](#monitoring--analytics)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## 🌐 Genel Bakış

Clinikoop, modern cloud-native deployment stratejileri kullanarak farklı ortamlara deploy edilir:

### Deployment Stratejisi
- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

### Teknoloji Stack
- **Frontend**: Next.js 14 App Router
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Production), SQLite (Development)
- **Deployment**: Vercel
- **Monitoring**: Vercel Analytics, Prometheus, Grafana

## 🏗️ Environment Types

### 1. Development Environment

**Amaç**: Geliştirici local development
**Database**: SQLite (file:./prisma/dev.db)
**Domain**: localhost:3000

```bash
# Environment Variables
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-development-secret"
NODE_ENV="development"
```

**Özellikler**:
- Hot reload
- Debug logging
- Local database
- Development tools

### 2. Staging Environment

**Amaç**: Pre-production testing
**Database**: PostgreSQL (Staging instance)
**Domain**: staging.clinikoop.vercel.app

```bash
# Environment Variables
DATABASE_URL="postgresql://user:pass@staging-host:5432/clinikoop_staging"
NEXTAUTH_URL="https://staging.clinikoop.vercel.app"
NEXTAUTH_SECRET="staging-secret-key"
NODE_ENV="production"
```

**Özellikler**:
- Production-like environment
- Test data
- Performance testing
- User acceptance testing

### 3. Production Environment

**Amaç**: Live production
**Database**: PostgreSQL (Production instance)
**Domain**: clinikoop.vercel.app

```bash
# Environment Variables
DATABASE_URL="postgresql://user:pass@prod-host:5432/clinikoop_prod"
NEXTAUTH_URL="https://clinikoop.vercel.app"
NEXTAUTH_SECRET="production-secret-key"
NODE_ENV="production"
```

**Özellikler**:
- High availability
- Performance optimized
- Security hardened
- Monitoring enabled

## 🚀 Vercel Deployment

### Vercel Konfigürasyonu

**vercel.json** dosyası deployment ayarlarını içerir:

```json
{
  "version": 2,
  "buildCommand": "npm run vercel-build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/admin",
      "destination": "/admin/dashboard"
    }
  ]
}
```

### Deployment Adımları

#### 1. Ön Gereksinimler
```bash
# PostgreSQL Database Provider seçin
- Neon (https://neon.tech) - Önerilen
- Supabase (https://supabase.com)
- Railway (https://railway.app)
- PlanetScale (https://planetscale.com)
```

#### 2. Vercel Project Setup
```bash
# 1. Vercel Dashboard'a gidin
# 2. "New Project" tıklayın
# 3. GitHub repository'nizi seçin
# 4. Framework Preset: Next.js seçin
```

#### 3. Environment Variables
```bash
# Production Environment Variables
DATABASE_URL="postgresql://user:pass@host:port/database"
NEXTAUTH_URL="https://clinikoop.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
NODE_ENV="production"
NEXT_PUBLIC_MAIN_DOMAIN="clinikoop.com"
NEXT_PUBLIC_BASE_URL="https://clinikoop.vercel.app"

# Preview Environment Variables (Staging)
DATABASE_URL="postgresql://user:pass@host:port/database_staging"
NEXTAUTH_URL="https://clinikoop-git-main.vercel.app"
NEXTAUTH_SECRET="your-staging-secret"
NODE_ENV="production"
```

#### 4. Build Settings
```bash
# Build Command
npm run vercel-build

# Install Command
npm install

# Output Directory
.next
```

### Vercel CLI Deployment

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Login
vercel login

# Environment variables'ları local'e çek
vercel env pull .env.local

# Deploy
vercel --prod

# Preview deployment
vercel
```

## 🗄️ Database Deployment

### PostgreSQL Setup

#### 1. Database Provider Seçimi

**Neon (Önerilen)**:
```bash
# 1. https://neon.tech'e gidin
# 2. Hesap oluşturun
# 3. Yeni project oluşturun
# 4. Connection string'i alın
```

**Supabase**:
```bash
# 1. https://supabase.com'a gidin
# 2. Hesap oluşturun
# 3. Yeni project oluşturun
# 4. Database connection string'i alın
```

#### 2. Database Migration

```bash
# Production migration
npx prisma migrate deploy

# Seed data yükle
npx prisma db seed

# Database schema kontrol
npx prisma db push --preview-feature
```

#### 3. Database Backup

```bash
# Backup script
./backup.sh

# Restore script
./restore.sh
```

### Database Monitoring

```bash
# Connection pool monitoring
# Query performance monitoring
# Storage usage monitoring
# Backup monitoring
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml**:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### Deployment Hooks

```bash
# Post-deploy script
npx prisma migrate deploy
npx prisma db seed
npm run build
```

## 📊 Monitoring & Analytics

### 1. Vercel Analytics

**Performance Metrics**:
- Function execution times
- Error rates
- Page load times
- Core Web Vitals

**Error Tracking**:
- Runtime errors
- Build errors
- API errors

### 2. Prometheus & Grafana

**Monitoring Stack**:
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus:/etc/prometheus
      
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    volumes:
      - ./monitoring/grafana:/etc/grafana
```

**Metrics**:
- HTTP request rates
- Database query performance
- Memory usage
- CPU usage

### 3. Health Checks

```typescript
// Health check endpoints
/api/health/env      // Environment health
/api/test-db         // Database health
/api/test-env        // Environment variables
```

## 🔒 Security

### 1. Environment Variables Security

```bash
# ✅ DOĞRU - Production'da güvenli
NEXTAUTH_SECRET="super-long-random-string-here"
DATABASE_URL="postgresql://user:pass@host:port/db"

# ❌ YANLIŞ - Güvenlik açığı
NEXTAUTH_SECRET="123456"
DATABASE_URL="postgresql://admin:admin@localhost/db"
```

### 2. Database Security

```bash
# Strong passwords kullanın
# IP whitelist uygulayın
# SSL connections zorunlu kılın
# Regular backups alın
```

### 3. Application Security

```typescript
// Security headers
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        }
      ]
    }
  ]
}
```

### 4. Authentication Security

```typescript
// NextAuth.js security
// lib/authOptions.ts
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // JWT security
      return token
    },
    async session({ session, token }) {
      // Session security
      return session
    }
  }
}
```

## 🔍 Troubleshooting

### 1. Build Hataları

```bash
# Local build test
npm run build

# Prisma generate
npx prisma generate

# TypeScript check
npx tsc --noEmit
```

### 2. Database Bağlantı Sorunları

```bash
# Connection test
npx prisma db push --preview-feature

# Migration status
npx prisma migrate status

# Database reset (DİKKAT!)
npx prisma migrate reset
```

### 3. Environment Variables Sorunları

```bash
# Environment check
curl https://your-domain.vercel.app/api/test-env

# Health check
curl https://your-domain.vercel.app/api/health/env
```

### 4. Performance Sorunları

```bash
# Bundle analyzer
npm run build
npx @next/bundle-analyzer

# Performance monitoring
# Vercel Analytics dashboard
```

### 5. Yaygın Hatalar ve Çözümleri

#### "Error validating datasource: the URL must start with the protocol"
```bash
# Çözüm: DATABASE_URL PostgreSQL formatında olmalı
# ❌ Yanlış: mysql://user:pass@host/db
# ✅ Doğru: postgresql://user:pass@host:port/db
```

#### "Dynamic server usage" hataları
```bash
# Çözüm: next.config.js'de output: 'standalone' ayarı
# Durum: Bu hatalar artık build'i durdurmayacak
```

#### "PrismaClientInitializationError"
```bash
# Çözüm: Environment variables'ları kontrol edin
# Durum: Build sırasında Prisma client otomatik generate edilir
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables set edildi
- [ ] Database migration tamamlandı
- [ ] Seed data yüklendi
- [ ] Build başarılı
- [ ] Tests geçti
- [ ] Security scan tamamlandı

### Post-Deployment
- [ ] SSL certificate aktif
- [ ] Custom domain ayarlandı
- [ ] Error monitoring aktif
- [ ] Performance monitoring aktif
- [ ] Backup strategy hazır
- [ ] Security headers ayarlandı
- [ ] Health checks başarılı

### Production Monitoring
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Error tracking
- [ ] Database monitoring
- [ ] Security monitoring

## 📞 Support

### Deployment Sorunları İçin:
1. **Vercel logs** kontrol edin
2. **Database connection** test edin
3. **Environment variables** kontrol edin
4. **Build logs** inceleyin
5. **Health check endpoints** test edin

### İletişim:
- **Email**: support@clinikoop.com
- **Documentation**: https://docs.clinikoop.com
- **GitHub Issues**: https://github.com/clinikoop/clinikoop/issues

---

**Son Güncelleme**: 2024-01-XX  
**Versiyon**: 1.0.0  
**Durum**: Production Ready 