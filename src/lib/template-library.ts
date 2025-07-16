import { PDFTemplate } from '@/types/pdf-template';

/**
 * Hazır PDF Şablonları Kütüphanesi
 * Farklı kategorilerde profesyonel şablonlar
 */
var TEMPLATE_LIBRARY = [
  // STANDART TEKLİF ŞABLONU
  {
    id: 'standard-offer-1',
    name: 'Standart Teklif',
    description: 'Klasik ve profesyonel teklif şablonu',
    category: 'standard',
    version: '1.0.0',
    author: 'Clinikoop',
    pages: [{
      id: 'page-1',
      elements: [
        // Header
        {
          id: 'header-logo',
          type: 'logo',
          content: '{{clinic.logo}}',
          x: 50,
          y: 30,
          width: 120,
          height: 60,
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'header-title',
          type: 'text',
          content: '{{clinic.name}}',
          x: 200,
          y: 40,
          width: 300,
          height: 30,
          fontSize: 24,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'header-subtitle',
          type: 'text',
          content: 'Diş Sağlığı ve Tedavi Merkezi',
          x: 200,
          y: 70,
          width: 300,
          height: 20,
          fontSize: 14,
          fontFamily: 'Arial',
          color: '#7f8c8d',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        // Teklif Başlığı
        {
          id: 'offer-title',
          type: 'text',
          content: 'TEDAVİ TEKLİFİ',
          x: 50,
          y: 120,
          width: 500,
          height: 40,
          fontSize: 28,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'center',
          zIndex: 1,
          isVisible: true
        },
        // Hasta Bilgileri
        {
          id: 'patient-section-title',
          type: 'text',
          content: 'HASTA BİLGİLERİ',
          x: 50,
          y: 180,
          width: 200,
          height: 25,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'patient-info',
          type: 'patient-info',
          content: '',
          x: 50,
          y: 210,
          width: 300,
          height: 120,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'left',
          zIndex: 1,
          isVisible: true,
          patientFieldsVisibility: {
            name: true,
            phone: true,
            email: true,
            address: true
          }
        },
        // Teklif Bilgileri
        {
          id: 'offer-section-title',
          type: 'text',
          content: 'TEKLİF BİLGİLERİ',
          x: 400,
          y: 180,
          width: 200,
          height: 25,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'offer-details',
          type: 'text',
          content: `Teklif No: {{offer.id}}
Tarih: {{offer.createdAt}}
Geçerlilik: {{offer.validUntil}}`,
          x: 400,
          y: 210,
          width: 200,
          height: 80,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        // Tedavi Bilgileri
        {
          id: 'treatment-section-title',
          type: 'text',
          content: 'TEDAVİ DETAYLARI',
          x: 50,
          y: 360,
          width: 200,
          height: 25,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'treatment-info',
          type: 'treatment-info',
          content: '',
          x: 50,
          y: 390,
          width: 500,
          height: 150,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'left',
          zIndex: 1,
          isVisible: true,
          treatmentFieldsVisibility: {
            treatments: true
          }
        },
        // Fiyat Tablosu
        {
          id: 'price-section-title',
          type: 'text',
          content: 'FİYAT TABLOSU',
          x: 50,
          y: 560,
          width: 200,
          height: 25,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'price-table',
          type: 'price-table',
          content: '',
          x: 50,
          y: 590,
          width: 500,
          height: 200,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'left',
          zIndex: 1,
          isVisible: true,
          showVAT: true,
          vatRate: 20
        },
        // Toplam
        {
          id: 'total-section',
          type: 'text',
          content: `TOPLAM TUTAR: {{offer.grandTotal}} {{offer.currency}}`,
          x: 400,
          y: 810,
          width: 200,
          height: 30,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'right',
          zIndex: 1,
          isVisible: true
        },
        // Footer
        {
          id: 'footer-contact',
          type: 'text',
          content: `İletişim: {{clinic.phone}} | {{clinic.email}}
Adres: {{clinic.address}}`,
          x: 50,
          y: 900,
          width: 500,
          height: 40,
          fontSize: 10,
          fontFamily: 'Arial',
          color: '#7f8c8d',
          alignment: 'center',
          zIndex: 1,
          isVisible: true
        }
      ],
      width: 794,
      height: 1123,
      backgroundColor: '#ffffff'
    }],
    defaultPageSize: 'a4',
    isDefault: true,
    isFixed: false,
    isPublic: true,
    tags: ['standart', 'profesyonel', 'klasik'],
    metadata: {
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      usageCount: 0,
      rating: 4.5,
      compatibility: ['v1.0']
    },
    settings: {
      allowCustomization: true,
      maxElementsPerPage: 50,
      supportedLanguages: ['tr', 'en'],
      colorScheme: 'light'
    }
  },

  // PREMIUM TEKLİF ŞABLONU
  {
    id: 'premium-offer-1',
    name: 'Premium Teklif',
    description: 'Lüks ve detaylı teklif şablonu',
    category: 'premium',
    version: '1.0.0',
    author: 'Clinikoop',
    pages: [{
      id: 'page-1',
      elements: [
        // Premium Header
        {
          id: 'premium-header-bg',
          type: 'image',
          content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzk0IiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmZmZmY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjhmOWZhO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+',
          x: 0,
          y: 0,
          width: 794,
          height: 100,
          zIndex: 0,
          isVisible: true
        },
        {
          id: 'premium-logo',
          type: 'logo',
          content: '{{clinic.logo}}',
          x: 50,
          y: 20,
          width: 80,
          height: 60,
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'premium-title',
          type: 'text',
          content: '{{clinic.name}}',
          x: 150,
          y: 25,
          width: 400,
          height: 35,
          fontSize: 28,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'premium-subtitle',
          type: 'text',
          content: 'Premium Diş Sağlığı Merkezi',
          x: 150,
          y: 60,
          width: 400,
          height: 25,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#7f8c8d',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        // Premium Teklif Başlığı
        {
          id: 'premium-offer-title',
          type: 'text',
          content: 'PREMIUM TEDAVİ TEKLİFİ',
          x: 50,
          y: 130,
          width: 500,
          height: 50,
          fontSize: 32,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'center',
          zIndex: 1,
          isVisible: true
        },
        // Hasta Bilgileri (Premium)
        {
          id: 'premium-patient-box',
          type: 'text',
          content: '',
          x: 50,
          y: 200,
          width: 300,
          height: 150,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          backgroundColor: '#f8f9fa',
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderRadius: 8,
          padding: 15,
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'premium-patient-title',
          type: 'text',
          content: 'HASTA BİLGİLERİ',
          x: 65,
          y: 210,
          width: 200,
          height: 25,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'left',
          zIndex: 2,
          isVisible: true
        },
        {
          id: 'premium-patient-info',
          type: 'patient-info',
          content: '',
          x: 65,
          y: 240,
          width: 270,
          height: 100,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'left',
          zIndex: 2,
          isVisible: true,
          patientFieldsVisibility: {
            name: true,
            phone: true,
            email: true,
            address: true,
            notes: true
          }
        },
        // Teklif Bilgileri (Premium)
        {
          id: 'premium-offer-box',
          type: 'text',
          content: '',
          x: 400,
          y: 200,
          width: 300,
          height: 150,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          backgroundColor: '#f8f9fa',
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderRadius: 8,
          padding: 15,
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'premium-offer-info-title',
          type: 'text',
          content: 'TEKLİF BİLGİLERİ',
          x: 415,
          y: 210,
          width: 200,
          height: 25,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'left',
          zIndex: 2,
          isVisible: true
        },
        {
          id: 'premium-offer-details',
          type: 'text',
          content: `Teklif No: {{offer.id}}
Oluşturulma: {{offer.createdAt}}
Geçerlilik: {{offer.validUntil}}
Durum: {{offer.status}}`,
          x: 415,
          y: 240,
          width: 270,
          height: 100,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'left',
          zIndex: 2,
          isVisible: true
        },
        // Tedavi Detayları (Premium)
        {
          id: 'premium-treatment-section',
          type: 'text',
          content: 'TEDAVİ DETAYLARI',
          x: 50,
          y: 380,
          width: 200,
          height: 30,
          fontSize: 18,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'premium-treatment-info',
          type: 'treatment-info',
          content: '',
          x: 50,
          y: 420,
          width: 650,
          height: 120,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          backgroundColor: '#f8f9fa',
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderRadius: 8,
          padding: 15,
          alignment: 'left',
          zIndex: 1,
          isVisible: true,
          treatmentFieldsVisibility: {
            treatments: true
          }
        },
        // Premium Fiyat Tablosu
        {
          id: 'premium-price-section',
          type: 'text',
          content: 'FİYAT TABLOSU',
          x: 50,
          y: 570,
          width: 200,
          height: 30,
          fontSize: 18,
          fontFamily: 'Arial',
          color: '#2c3e50',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'premium-price-table',
          type: 'price-table',
          content: '',
          x: 50,
          y: 610,
          width: 650,
          height: 200,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderRadius: 8,
          padding: 15,
          alignment: 'left',
          zIndex: 1,
          isVisible: true,
          showVAT: true,
          vatRate: 20
        },
        // Premium Toplam
        {
          id: 'premium-total-box',
          type: 'text',
          content: '',
          x: 500,
          y: 830,
          width: 200,
          height: 60,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#2c3e50',
          backgroundColor: '#e8f5e8',
          borderWidth: 2,
          borderColor: '#27ae60',
          borderRadius: 8,
          padding: 10,
          alignment: 'center',
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'premium-total-text',
          type: 'text',
          content: `TOPLAM: {{offer.grandTotal}} {{offer.currency}}`,
          x: 510,
          y: 850,
          width: 180,
          height: 20,
          fontSize: 18,
          fontFamily: 'Arial',
          color: '#27ae60',
          alignment: 'center',
          zIndex: 2,
          isVisible: true
        },
        // Premium Footer
        {
          id: 'premium-footer',
          type: 'text',
          content: `{{clinic.name}} | {{clinic.phone}} | {{clinic.email}}
{{clinic.address}}`,
          x: 50,
          y: 950,
          width: 650,
          height: 40,
          fontSize: 10,
          fontFamily: 'Arial',
          color: '#7f8c8d',
          alignment: 'center',
          zIndex: 1,
          isVisible: true
        }
      ],
      width: 794,
      height: 1123,
      backgroundColor: '#ffffff'
    }],
    defaultPageSize: 'a4',
    isDefault: false,
    isFixed: false,
    isPublic: true,
    tags: ['premium', 'lüks', 'detaylı'],
    metadata: {
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      usageCount: 0,
      rating: 4.8,
      compatibility: ['v1.0']
    },
    settings: {
      allowCustomization: true,
      maxElementsPerPage: 50,
      supportedLanguages: ['tr', 'en'],
      colorScheme: 'light'
    }
  },

  // MİNİMAL ŞABLON
  {
    id: 'minimal-offer-1',
    name: 'Minimal Teklif',
    description: 'Sade ve modern tasarım şablonu',
    category: 'minimal',
    version: '1.0.0',
    author: 'Clinikoop',
    pages: [{
      id: 'page-1',
      elements: [
        // Minimal Header
        {
          id: 'minimal-logo',
          type: 'logo',
          content: '{{clinic.logo}}',
          x: 50,
          y: 50,
          width: 60,
          height: 60,
          zIndex: 1,
          isVisible: true
        },
        {
          id: 'minimal-title',
          type: 'text',
          content: '{{clinic.name}}',
          x: 130,
          y: 65,
          width: 300,
          height: 30,
          fontSize: 20,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        // Minimal Ayırıcı
        {
          id: 'minimal-divider',
          type: 'text',
          content: '',
          x: 50,
          y: 120,
          width: 500,
          height: 2,
          backgroundColor: '#e0e0e0',
          zIndex: 1,
          isVisible: true
        },
        // Minimal Teklif Başlığı
        {
          id: 'minimal-offer-title',
          type: 'text',
          content: 'Teklif',
          x: 50,
          y: 150,
          width: 200,
          height: 40,
          fontSize: 36,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'left',
          zIndex: 1,
          isVisible: true
        },
        // Minimal Hasta Bilgileri
        {
          id: 'minimal-patient-info',
          type: 'patient-info',
          content: '',
          x: 50,
          y: 220,
          width: 400,
          height: 100,
          fontSize: 14,
          fontFamily: 'Arial',
          color: '#666666',
          alignment: 'left',
          zIndex: 1,
          isVisible: true,
          patientFieldsVisibility: {
            name: true,
            phone: true,
            email: true
          }
        },
        // Minimal Tedavi Listesi
        {
          id: 'minimal-treatment-info',
          type: 'treatment-info',
          content: '',
          x: 50,
          y: 350,
          width: 500,
          height: 150,
          fontSize: 14,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'left',
          zIndex: 1,
          isVisible: true,
          treatmentFieldsVisibility: {
            treatments: true
          }
        },
        // Minimal Fiyat Tablosu
        {
          id: 'minimal-price-table',
          type: 'price-table',
          content: '',
          x: 50,
          y: 530,
          width: 500,
          height: 150,
          fontSize: 14,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'left',
          zIndex: 1,
          isVisible: true,
          showVAT: false,
          vatRate: 20
        },
        // Minimal Toplam
        {
          id: 'minimal-total',
          type: 'text',
          content: `{{offer.grandTotal}} {{offer.currency}}`,
          x: 400,
          y: 700,
          width: 150,
          height: 30,
          fontSize: 24,
          fontFamily: 'Arial',
          color: '#333333',
          alignment: 'right',
          zIndex: 1,
          isVisible: true
        },
        // Minimal Footer
        {
          id: 'minimal-footer',
          type: 'text',
          content: '{{clinic.phone}}',
          x: 50,
          y: 800,
          width: 500,
          height: 20,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#999999',
          alignment: 'center',
          zIndex: 1,
          isVisible: true
        }
      ],
      width: 794,
      height: 1123,
      backgroundColor: '#ffffff'
    }],
    defaultPageSize: 'a4',
    isDefault: false,
    isFixed: false,
    isPublic: true,
    tags: ['minimal', 'sade', 'modern'],
    metadata: {
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      usageCount: 0,
      rating: 4.2,
      compatibility: ['v1.0']
    },
    settings: {
      allowCustomization: true,
      maxElementsPerPage: 30,
      supportedLanguages: ['tr', 'en'],
      colorScheme: 'light'
    }
  },

  {
    id: 'modern-clinic',
    name: 'Modern Klinik',
    description: 'Temiz ve modern tasarım, profesyonel görünüm',
    category: 'standard',
    version: '1.0.0',
    author: 'Clinikoop',
    pages: [
      {
        id: 'page-1',
        width: 794,
        height: 1123,
        elements: [
          {
            id: 'header',
            type: 'text',
            content: '{{clinic.name}}',
            x: 50,
            y: 50,
            width: 694,
            height: 60,
            fontSize: 32,
            fontFamily: 'helvetica',
            color: '#2563eb',
            alignment: 'center',
            isVisible: true,
            zIndex: 1
          },
          {
            id: 'slogan',
            type: 'text',
            content: '{{clinic.slogan}}',
            x: 50,
            y: 120,
            width: 694,
            height: 30,
            fontSize: 16,
            fontFamily: 'helvetica',
            color: '#6b7280',
            alignment: 'center',
            isVisible: true,
            zIndex: 1
          },
          {
            id: 'patient-info-title',
            type: 'text',
            content: 'Hasta Bilgileri',
            x: 50,
            y: 180,
            width: 200,
            height: 30,
            fontSize: 20,
            fontFamily: 'helvetica',
            color: '#1f2937',
            alignment: 'left',
            isVisible: true,
            zIndex: 1
          },
          {
            id: 'patient-name',
            type: 'text',
            content: 'Ad Soyad: {{patient.firstName}} {{patient.lastName}}',
            x: 50,
            y: 220,
            width: 300,
            height: 20,
            fontSize: 14,
            fontFamily: 'helvetica',
            color: '#374151',
            alignment: 'left',
            isVisible: true,
            zIndex: 1
          },
          {
            id: 'patient-phone',
            type: 'text',
            content: 'Telefon: {{patient.phone}}',
            x: 50,
            y: 250,
            width: 300,
            height: 20,
            fontSize: 14,
            fontFamily: 'helvetica',
            color: '#374151',
            alignment: 'left',
            isVisible: true,
            zIndex: 1
          },
          {
            id: 'patient-email',
            type: 'text',
            content: 'E-posta: {{patient.email}}',
            x: 50,
            y: 280,
            width: 300,
            height: 20,
            fontSize: 14,
            fontFamily: 'helvetica',
            color: '#374151',
            alignment: 'left',
            isVisible: true,
            zIndex: 1
          },
          {
            id: 'offer-date',
            type: 'text',
            content: 'Teklif Tarihi: {{offerDate}}',
            x: 50,
            y: 310,
            width: 300,
            height: 20,
            fontSize: 14,
            fontFamily: 'helvetica',
            color: '#374151',
            alignment: 'left',
            isVisible: true,
            zIndex: 1
          },
          {
            id: 'treatments-title',
            type: 'text',
            content: 'Tedavi Detayları',
            x: 50,
            y: 370,
            width: 200,
            height: 30,
            fontSize: 20,
            fontFamily: 'helvetica',
            color: '#1f2937',
            alignment: 'left',
            isVisible: true,
            zIndex: 1
          },
          {
            id: 'price-table',
            type: 'price-table',
            content: '',
            x: 50,
            y: 420,
            width: 694,
            height: 300,
            fontSize: 14,
            fontFamily: 'helvetica',
            color: '#374151',
            alignment: 'left',
            isVisible: true,
            zIndex: 1
          },
          {
            id: 'footer-clinic-info',
            type: 'text',
            content: '{{clinic.address}}',
            x: 50,
            y: 1050,
            width: 694,
            height: 20,
            fontSize: 12,
            fontFamily: 'helvetica',
            color: '#6b7280',
            alignment: 'center',
            isVisible: true,
            zIndex: 1
          },
          {
            id: 'footer-contact',
            type: 'text',
            content: 'Tel: {{clinic.phone}} | E-posta: {{clinic.email}}',
            x: 50,
            y: 1070,
            width: 694,
            height: 20,
            fontSize: 12,
            fontFamily: 'helvetica',
            color: '#6b7280',
            alignment: 'center',
            isVisible: true,
            zIndex: 1
          }
        ]
      }
    ],
    defaultPageSize: 'a4',
    isDefault: true,
    isFixed: false,
    isPublic: true,
    tags: ['modern', 'clean', 'professional'],
    metadata: {
      createdAt: '2024-06-29T00:00:00Z',
      updatedAt: '2024-06-29T00:00:00Z',
      usageCount: 0,
      compatibility: ['v1']
    },
    settings: {
      allowCustomization: true,
      maxElementsPerPage: 30,
      supportedLanguages: ['tr', 'en'],
      colorScheme: 'light'
    }
  }
];

/**
 * Şablon kütüphanesi yardımcı fonksiyonları
 */
export class TemplateLibrary {
  /**
   * Kategoriye göre şablonları getir
   */
  static getTemplatesByCategory(category: string): PDFTemplate[] {
    return TEMPLATE_LIBRARY.filter(template => template.category === category);
  }

  /**
   * Tag'e göre şablonları getir
   */
  static getTemplatesByTag(tag: string): PDFTemplate[] {
    return TEMPLATE_LIBRARY.filter(template => 
      template.tags.includes(tag)
    );
  }

  /**
   * ID'ye göre şablon getir
   */
  static getTemplateById(id: string): PDFTemplate | undefined {
    return TEMPLATE_LIBRARY.find(template => template.id === id);
  }

  /**
   * Varsayılan şablonu getir
   */
  static getDefaultTemplate(): PDFTemplate | undefined {
    return TEMPLATE_LIBRARY.find(template => template.isDefault);
  }

  /**
   * Popüler şablonları getir (rating'e göre)
   */
  static getPopularTemplates(limit: number = 5): PDFTemplate[] {
    return TEMPLATE_LIBRARY
      .filter(template => template.metadata.rating)
      .sort((a, b) => (b.metadata.rating || 0) - (a.metadata.rating || 0))
      .slice(0, limit);
  }

  /**
   * Yeni şablonları getir
   */
  static getNewTemplates(limit: number = 5): PDFTemplate[] {
    return TEMPLATE_LIBRARY
      .sort((a, b) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime())
      .slice(0, limit);
  }
}

module.exports = { TEMPLATE_LIBRARY }; 