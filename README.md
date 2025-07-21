# 🏥 Clinikoop - Diş Klinikleri için SaaS Platformu

Clinikoop, diş kliniklerinin hasta teklif süreçlerini yönetmesine odaklanan, link tabanlı hasta erişimi sunan, PDF üretimi destekleyen tek-klinik yapılı bir SaaS platformudur.

## 🚀 Özellikler

- **Multi-tenant Architecture** - Her klinik kendi subdomain'inde çalışır
- **Hasta Yönetimi** - Kapsamlı hasta kayıt ve takip sistemi
- **Teklif Oluşturma** - PDF teklifleri ve link paylaşımı
- **Hatırlatma Sistemi** - Hasta ve teklif takibi
- **Raporlama** - Detaylı analiz ve performans raporları
- **Admin Panel** - Merkezi yönetim sistemi
- **Destek Sistemi** - Ticket tabanlı destek

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Production), SQLite (Development)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **PDF Generation**: html2pdf.js, react-pdf

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel sayfaları
│   ├── api/               # API routes
│   ├── site/              # Klinik kullanıcı sayfaları
│   └── offer/             # Hasta teklif görüntüleme
├── components/            # UI bileşenleri
├── lib/                   # Utilities ve konfigürasyon
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── contexts/              # React contexts
```

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- PostgreSQL (Production)
- SQLite (Development)

### Kurulum

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/your-username/clinikoop.git
cd clinikoop
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment variables'ları ayarlayın**
```bash
cp .env.example .env.local
```

4. **Database'i hazırlayın**
```bash
npm run db:deploy
```

5. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

## 🌐 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email (Opsiyonel)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 📊 Database Schema

Ana modeller:
- **Clinic** - Klinik bilgileri
- **ClinicUser** - Klinik kullanıcıları
- **Patient** - Hasta kayıtları
- **Offer** - Tedavi teklifleri
- **Treatment** - Tedavi detayları
- **Reminder** - Hatırlatmalar
- **SupportTicket** - Destek talepleri

## 🔐 Authentication & Authorization

- **Patient Access**: Tokenized links, login gerekmez
- **Admin/Sales**: NextAuth.js ile tam login sistemi
- **Role-based Access**: SUPER_ADMIN, ADMIN, USER
- **Multi-tenant**: Clinic-based isolation

## 📈 Monitoring & Analytics

- **Prometheus Metrics**: Business ve technical metrics
- **Grafana Dashboards**: Real-time monitoring
- **Activity Logs**: User activity tracking
- **System Logs**: Error ve performance logging

## 🚀 Deployment

### Vercel Deployment

1. **Vercel'e bağlayın**
```bash
vercel
```

2. **Environment variables'ları ayarlayın**
3. **Database migration'ları çalıştırın**
4. **Seed data'yı yükleyin**

### Production Checklist

- [ ] Environment variables set
- [ ] Database migration completed
- [ ] Seed data loaded
- [ ] Build successful
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security headers set
- [ ] Monitoring configured

## 📚 Modül Dokümantasyonu

Detaylı modül dokümantasyonu için [docs/](./docs/) klasörüne bakın:

- [Hasta Modülü](./docs/patient-module.md)
- [Teklif Modülü](./docs/offer-module.md)
- [Hatırlatma Modülü](./docs/reminder-module.md)
- [Admin Modülü](./docs/admin-module.md)
- [Raporlama Modülü](./docs/reporting-module.md)
- [Destek Modülü](./docs/support-module.md)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 Destek

- **Email**: support@clinikoop.com
- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/clinikoop/issues)

---

**Clinikoop** - Diş klinikleri için modern SaaS çözümü 🦷 

## Önemli Backend Mimari Notu (Teklif Oluşturma ve Notlar)

- Teklif oluşturma API'sinde **her klinik için otomatik olarak admin@clinikoop.com ile kullanıcı oluşturulmaz**.
- Eğer bir teklif veya not oluşturulurken kullanıcı bilgisi (createdById, userId) oturumdan alınamıyorsa, bu alanlar ya hiç gönderilmez ya da not oluşturma işlemi tamamen atlanır.
- Not oluşturma işlemi için **userId zorunludur**. Oturumdan veya frontendden kullanıcı ID'si alınamıyorsa not oluşturulmaz.
- Aksi halde, aynı email ile birden fazla kullanıcı oluşturulmaya çalışılırsa **Prisma unique constraint hatası** oluşur ve teklif kaydedilemez.
- İleride kullanıcı yönetimi ve audit trail için, createdById ve userId alanlarının doğru şekilde oturumdan alınması ve frontendden güvenli şekilde iletilmesi gerekmektedir.
- Bu mimari karar, çoklu klinik ve çoklu kullanıcı desteği için kritik öneme sahiptir. 