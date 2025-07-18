// PDF Şablon Sistemi için Tip Tanımları

export interface PDFElement {
  id: string;
  type: 'text' | 'image' | 'logo' | 'price-table' | 'patient-info' | 'treatment-info' | 'qr-code' | 'barcode' | 'signature' | 'stamp';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  alignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  rotation?: number;
  zIndex: number;
  isVisible: boolean;
  
  // Dinamik veri alanları
  dataField?: string; // Örn: 'patient.name', 'offer.totalPrice'
  placeholder?: string; // Örn: '{{patient.name}}'
  
  // Özel element özellikleri
  priceTableData?: PriceTableItem[];
  showVAT?: boolean;
  vatRate?: number;
  currency?: string;
  
  patientData?: {
    name?: string;
    age?: number;
    phone?: string;
    email?: string;
    address?: string;
    diagnosis?: string;
    notes?: string;
  };
  
  treatmentData?: {
    treatments?: string[];
    recommendations?: string;
    nextAppointment?: string;
    doctor?: string;
  };
  
  // Görünürlük ayarları
  patientFieldsVisibility?: Partial<{
    name: boolean;
    age: boolean;
    phone: boolean;
    email: boolean;
    address: boolean;
    diagnosis: boolean;
    notes: boolean;
  }>;
  
  treatmentFieldsVisibility?: Partial<{
    treatments: boolean;
    recommendations: boolean;
    nextAppointment: boolean;
    doctor: boolean;
  }>;
  
  // Stil özellikleri
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderRadius?: number;
  padding?: number;
  margin?: number;
  
  // Animasyon ve efektler (gelecekte)
  animation?: {
    type: 'fade' | 'slide' | 'zoom';
    duration: number;
    delay: number;
  };
}

export interface PDFPage {
  id: string;
  elements: PDFElement[];
  backgroundColor?: string;
  width: number;
  height: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  header?: PDFElement[];
  footer?: PDFElement[];
}

export interface PDFTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'standard' | 'premium' | 'minimal' | 'medical' | 'corporate' | 'custom';
  version: string;
  author?: string;
  pages: PDFPage[];
  defaultPageSize: 'a4' | 'letter' | 'legal' | 'custom';
  isDefault: boolean;
  isFixed: boolean;
  isPublic: boolean;
  tags: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    usageCount: number;
    rating?: number;
    compatibility: string[];
  };
  settings: {
    allowCustomization: boolean;
    maxElementsPerPage: number;
    supportedLanguages: string[];
    colorScheme: 'light' | 'dark' | 'auto';
  };
}

export interface PriceTableItem {
  id: string;
  treatment: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
  currency: string;
  vatRate: number;
  vatAmount: number;
}

// Dinamik veri alanları için tip tanımları
export interface DynamicDataFields {
  // Hasta bilgileri
  patient: {
    name: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: string;
    address: string;
    notes: string;
    socialMedia: {
      instagram?: string;
      facebook?: string;
      whatsapp?: string;
    };
  };
  
  // Teklif bilgileri
  offer: {
    id: string;
    slug: string;
    title: string;
    description: string;
    totalPrice: number;
    currency: string;
    vatRate: number;
    vatAmount: number;
    grandTotal: number;
    status: string;
    createdAt: string;
    validUntil: string;
    estimatedDays: number;
    estimatedHours: number;
  };
  
  // Tedavi bilgileri
  treatments: Array<{
    id: string;
    name: string;
    key: string;
    category: string;
    description: string;
    price: number;
    quantity: number;
    currency: string;
    selectedTeeth: number[];
    notes: string;
  }>;
  
  // Klinik bilgileri
  clinic: {
    name: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    socialMedia: {
      instagram?: string;
      facebook?: string;
      whatsapp?: string;
    };
  };
  
  // Sistem bilgileri
  system: {
    currentDate: string;
    currentTime: string;
    pageNumber: number;
    totalPages: number;
    generatedAt: string;
  };
}

// Şablon kategorileri
export const TEMPLATE_CATEGORIES = [
  {
    key: 'standard',
    label: 'Standart Teklif',
    description: 'Klasik ve profesyonel teklif şablonları',
    icon: '📄',
    color: 'blue'
  },
  {
    key: 'premium',
    label: 'Premium Teklif',
    description: 'Lüks ve detaylı teklif şablonları',
    icon: '💎',
    color: 'purple'
  },
  {
    key: 'minimal',
    label: 'Minimal',
    description: 'Sade ve modern tasarım şablonları',
    icon: '⚪',
    color: 'gray'
  },
  {
    key: 'medical',
    label: 'Medikal',
    description: 'Sağlık sektörüne özel şablonlar',
    icon: '🏥',
    color: 'green'
  },
  {
    key: 'corporate',
    label: 'Kurumsal',
    description: 'Kurumsal kimliğe uygun şablonlar',
    icon: '🏢',
    color: 'indigo'
  },
  {
    key: 'custom',
    label: 'Özel',
    description: 'Özel tasarım şablonları',
    icon: '🎨',
    color: 'pink'
  }
] as const;

// Şablon versiyonlama
export interface TemplateVersion {
  id: string;
  templateId: string;
  version: string;
  changes: string[];
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

// Şablon kullanım istatistikleri
export interface TemplateUsage {
  id: string;
  templateId: string;
  userId: string;
  offerId: string;
  usedAt: string;
  success: boolean;
  errorMessage?: string;
} 