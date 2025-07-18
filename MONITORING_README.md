# Clinikoop Monitoring Sistemi

Bu proje Grafana ve Prometheus kullanarak kapsamlı bir monitoring sistemi içerir.

## 🚀 Kurulum

### Gereksinimler
- Docker Desktop
- Node.js 18+
- npm

### Monitoring Stack'i Başlatma

```bash
# Monitoring stack'i başlat
docker compose -f docker-compose.monitoring.yml up -d

# Durumu kontrol et
docker ps
```

### Next.js Uygulamasını Başlatma

```bash
# Uygulamayı başlat
npm run dev
```

## 📊 Erişim Bilgileri

### Grafana
- **URL**: http://localhost:3001
- **Kullanıcı**: admin
- **Şifre**: clinikoop2024

### Prometheus
- **URL**: http://localhost:9090
- **Targets**: http://localhost:9090/targets

### Node Exporter
- **URL**: http://localhost:9100/metrics

## 📈 Toplanan Metrikler

### HTTP Metrikleri
- `http_request_duration_seconds`: İstek süreleri
- `http_requests_total`: Toplam istek sayısı
- `errors_total`: Hata sayısı

### Database Metrikleri
- `database_query_duration_seconds`: Sorgu süreleri
- `database_connections_active`: Aktif bağlantı sayısı

### Business Metrikleri
- `offers_created_total`: Oluşturulan teklif sayısı
- `patients_created_total`: Oluşturulan hasta sayısı
- `pdf_generated_total`: Oluşturulan PDF sayısı
- `active_users_total`: Aktif kullanıcı sayısı

### Performance Metrikleri
- `page_load_duration_seconds`: Sayfa yükleme süreleri

## 🔧 Konfigürasyon

### Prometheus
- Konfigürasyon: `monitoring/prometheus/prometheus.yml`
- Veri saklama: 200 saat
- Scrape interval: 15-60 saniye

### Grafana
- Dashboard: `monitoring/grafana/dashboards/clinikoop-dashboard.json`
- Datasource: Otomatik olarak Prometheus'a bağlanır

## 🧪 Test

Metrikleri test etmek için:

```bash
# Test script'ini çalıştır
node test-metrics.js

# Manuel test
curl http://localhost:3000/api/metrics
```

## 📋 Dashboard Panelleri

1. **HTTP İstekleri**: İstek sayısı ve süreleri
2. **İstek Süreleri**: 95th percentile response time
3. **Oluşturulan Teklifler**: Klinik bazında teklif sayısı
4. **Oluşturulan Hastalar**: Klinik bazında hasta sayısı
5. **PDF Oluşturma**: PDF generation metrikleri
6. **Aktif Kullanıcılar**: Klinik bazında aktif kullanıcı
7. **Database Sorgu Süreleri**: Prisma sorgu performansı
8. **Hata Oranları**: Error rate tracking

## 🔍 Multi-Tenant Monitoring

Sistem subdomain mantığında çalışır:
- Her klinik için ayrı `clinic_id` label'ı
- Klinik bazında metrik filtreleme
- Performans karşılaştırması

## 🛠️ Geliştirme

### Yeni Metrik Ekleme

1. `src/lib/metrics.ts` dosyasına metrik tanımla
2. İlgili API route'unda metrik kaydet
3. Grafana dashboard'una panel ekle

### Örnek:

```typescript
// Metrik tanımla
export const newMetric = new Counter({
  name: 'new_metric_total',
  help: 'Yeni metrik açıklaması',
  labelNames: ['clinic_id', 'status']
});

// API'de kullan
newMetric.inc({ clinic_id: clinicId, status: 'success' });
```

## 🚨 Alerting

Gelecek özellikler:
- Grafana Alerting kuralları
- Email/SMS bildirimleri
- Slack entegrasyonu
- Custom alert thresholds

## 📚 Faydalar

1. **Performance Monitoring**: Sayfa yükleme süreleri, API response time
2. **Business Intelligence**: Teklif dönüşüm oranları, hasta sayıları
3. **Error Tracking**: Hata oranları ve türleri
4. **Capacity Planning**: Database performansı, sistem kaynakları
5. **Multi-tenant Analytics**: Klinik bazında performans karşılaştırması

## 🔧 Troubleshooting

### Prometheus Hedefleri Down
```bash
# Container durumunu kontrol et
docker ps

# Logları kontrol et
docker logs clinikoop-prometheus

# Next.js uygulamasının çalıştığını kontrol et
curl http://localhost:3000/api/metrics
```

### Grafana Bağlantı Sorunu
```bash
# Grafana container'ını yeniden başlat
docker restart clinikoop-grafana

# Datasource'u kontrol et
# Grafana UI > Configuration > Data Sources
```

## 📈 Gelecek Planları

- [ ] Custom Grafana dashboard'ları
- [ ] Alerting kuralları
- [ ] Log aggregation (ELK stack)
- [ ] APM (Application Performance Monitoring)
- [ ] Real-time monitoring
- [ ] Mobile app metrikleri 