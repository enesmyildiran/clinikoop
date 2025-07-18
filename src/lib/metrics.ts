import { register, Counter, Histogram, Gauge } from 'prom-client'

// Metrik kayıt defteri
export const metricsRegistry = register

// HTTP istekleri için metrikler
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP istek süreleri',
  labelNames: ['method', 'route', 'status_code', 'clinic_id'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
})

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Toplam HTTP istek sayısı',
  labelNames: ['method', 'route', 'status_code', 'clinic_id']
})

// Database metrikleri
export const databaseQueryDuration = new Histogram({
  name: 'database_query_duration_seconds',
  help: 'Database sorgu süreleri',
  labelNames: ['operation', 'table', 'clinic_id'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5]
})

export const databaseConnections = new Gauge({
  name: 'database_connections_active',
  help: 'Aktif database bağlantı sayısı',
  labelNames: ['clinic_id']
})

// Business metrikleri
export const offersCreated = new Counter({
  name: 'offers_created_total',
  help: 'Oluşturulan teklif sayısı',
  labelNames: ['clinic_id', 'status']
})

export const patientsCreated = new Counter({
  name: 'patients_created_total',
  help: 'Oluşturulan hasta sayısı',
  labelNames: ['clinic_id']
})

export const pdfGenerated = new Counter({
  name: 'pdf_generated_total',
  help: 'Oluşturulan PDF sayısı',
  labelNames: ['clinic_id', 'template_type']
})

export const activeUsers = new Gauge({
  name: 'active_users_total',
  help: 'Aktif kullanıcı sayısı',
  labelNames: ['clinic_id']
})

// Error metrikleri
export const errorsTotal = new Counter({
  name: 'errors_total',
  help: 'Toplam hata sayısı',
  labelNames: ['type', 'clinic_id', 'route']
})

// Performance metrikleri
export const pageLoadDuration = new Histogram({
  name: 'page_load_duration_seconds',
  help: 'Sayfa yükleme süreleri',
  labelNames: ['page', 'clinic_id'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5, 10]
})

// Metrik toplama fonksiyonu
export async function collectMetrics() {
  return await register.metrics()
}

// Metrik temizleme fonksiyonu
export function clearMetrics() {
  register.clear()
} 