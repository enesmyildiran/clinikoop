import { PDFTemplate, PDFElement, DynamicDataFields } from '@/types/pdf-template';

/**
 * PDF Şablon Motoru
 * Dinamik veri eşleştirme ve placeholder sistemi
 */
export class PDFTemplateEngine {
  private data: DynamicDataFields;
  private template: PDFTemplate;

  constructor(template: PDFTemplate, data: DynamicDataFields) {
    this.template = template;
    this.data = data;
  }

  /**
   * Şablonu verilerle doldur ve hazır PDFTemplate döndür
   */
  public processTemplate(): PDFTemplate {
    const processedTemplate = { ...this.template };
    
    processedTemplate.pages = this.template.pages.map(page => ({
      ...page,
      elements: page.elements.map(element => this.processElement(element))
    }));

    return processedTemplate;
  }

  /**
   * Tek bir elementi işle
   */
  private processElement(element: PDFElement): PDFElement {
    const processedElement = { ...element };

    // Content'i işle
    if (element.content) {
      processedElement.content = this.replacePlaceholders(element.content);
    }

    // Dinamik veri alanlarını işle
    if (element.dataField) {
      const value = this.getDataValue(element.dataField);
      if (value !== undefined) {
        processedElement.content = String(value);
      }
    }

    // Özel element tiplerini işle
    switch (element.type) {
      case 'patient-info':
        return this.processPatientInfoElement(processedElement);
      case 'treatment-info':
        return this.processTreatmentInfoElement(processedElement);
      case 'price-table':
        return this.processPriceTableElement(processedElement);
      default:
        return processedElement;
    }
  }

  /**
   * Placeholder'ları gerçek verilerle değiştir
   */
  private replacePlaceholders(content: string): string {
    return content.replace(/\{\{([^}]+)\}\}/g, (match, field) => {
      const value = this.getDataValue(field.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Veri alanından değer al
   */
  private getDataValue(field: string): any {
    const parts = field.split('.');
    let current: any = this.data;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * Hasta bilgileri elementini işle
   */
  private processPatientInfoElement(element: PDFElement): PDFElement {
    const patient = this.data.patient;
    
    if (element.patientFieldsVisibility) {
      // Görünürlük ayarlarına göre içeriği oluştur
      let content = '';
      
      if (element.patientFieldsVisibility.name && patient.name) {
        content += `Ad Soyad: ${patient.name}\n`;
      }
      if (element.patientFieldsVisibility.phone && patient.phone) {
        content += `Telefon: ${patient.phone}\n`;
      }
      if (element.patientFieldsVisibility.email && patient.email) {
        content += `E-posta: ${patient.email}\n`;
      }
      if (element.patientFieldsVisibility.address && patient.address) {
        content += `Adres: ${patient.address}\n`;
      }
      if (element.patientFieldsVisibility.notes && patient.notes) {
        content += `Notlar: ${patient.notes}\n`;
      }

      element.content = content.trim();
    }

    return element;
  }

  /**
   * Tedavi bilgileri elementini işle
   */
  private processTreatmentInfoElement(element: PDFElement): PDFElement {
    const treatments = this.data.treatments;
    
    if (element.treatmentFieldsVisibility) {
      let content = '';
      
      if (element.treatmentFieldsVisibility.treatments && treatments.length > 0) {
        content += 'Tedaviler:\n';
        treatments.forEach((treatment, index) => {
          content += `${index + 1}. ${treatment.name}`;
          if (treatment.description) {
            content += ` - ${treatment.description}`;
          }
          if (treatment.selectedTeeth && treatment.selectedTeeth.length > 0) {
            content += ` (Diş: ${treatment.selectedTeeth.join(', ')})`;
          }
          content += '\n';
        });
      }

      element.content = content.trim();
    }

    return element;
  }

  /**
   * Fiyat tablosu elementini işle
   */
  private processPriceTableElement(element: PDFElement): PDFElement {
    const treatments = this.data.treatments;
    const offer = this.data.offer;
    
    // Fiyat tablosu verilerini oluştur
    const priceTableData = treatments.map(treatment => ({
      id: treatment.id,
      treatment: treatment.name,
      description: treatment.description || '',
      price: treatment.price,
      quantity: treatment.quantity,
      total: treatment.price * treatment.quantity,
      currency: treatment.currency || offer.currency,
      vatRate: offer.vatRate || 20,
      vatAmount: (treatment.price * treatment.quantity * (offer.vatRate || 20)) / 100
    }));

    element.priceTableData = priceTableData;
    element.currency = offer.currency;
    element.vatRate = offer.vatRate;

    return element;
  }

  /**
   * Şablonu doğrula
   */
  public validateTemplate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Gerekli alanları kontrol et
    if (!this.template.name) {
      errors.push('Şablon adı gereklidir');
    }

    if (!this.template.pages || this.template.pages.length === 0) {
      errors.push('En az bir sayfa gereklidir');
    }

    // Elementleri kontrol et
    this.template.pages.forEach((page, pageIndex) => {
      page.elements.forEach((element, elementIndex) => {
        if (!element.id) {
          errors.push(`Sayfa ${pageIndex + 1}, Element ${elementIndex + 1}: ID gereklidir`);
        }

        if (element.x < 0 || element.y < 0) {
          errors.push(`Sayfa ${pageIndex + 1}, Element ${elementIndex + 1}: Pozisyon değerleri negatif olamaz`);
        }

        if (element.width <= 0 || element.height <= 0) {
          errors.push(`Sayfa ${pageIndex + 1}, Element ${elementIndex + 1}: Boyut değerleri pozitif olmalıdır`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Şablon istatistiklerini hesapla
   */
  public getTemplateStats(): {
    totalElements: number;
    elementTypes: Record<string, number>;
    totalPages: number;
    estimatedSize: number;
  } {
    const elementTypes: Record<string, number> = {};
    let totalElements = 0;

    this.template.pages.forEach(page => {
      page.elements.forEach(element => {
        totalElements++;
        elementTypes[element.type] = (elementTypes[element.type] || 0) + 1;
      });
    });

    // Tahmini dosya boyutu (basit hesaplama)
    const estimatedSize = totalElements * 1024; // Her element ~1KB

    return {
      totalElements,
      elementTypes,
      totalPages: this.template.pages.length,
      estimatedSize
    };
  }
}

/**
 * Şablon yardımcı fonksiyonları
 */
export class TemplateUtils {
  /**
   * Varsayılan şablon oluştur
   */
  static createDefaultTemplate(name: string, category: string = 'standard'): PDFTemplate {
    return {
      id: `template-${Date.now()}`,
      name,
      description: 'Varsayılan şablon',
      category: category as any,
      version: '1.0.0',
      author: 'Sistem',
      pages: [{
        id: 'page-1',
        elements: [
          {
            id: 'header',
            type: 'text',
            content: '{{clinic.name}}',
            x: 50,
            y: 50,
            width: 300,
            height: 40,
            fontSize: 24,
            fontFamily: 'Arial',
            color: '#000000',
            alignment: 'center',
            zIndex: 1,
            isVisible: true
          },
          {
            id: 'patient-info',
            type: 'patient-info',
            content: '',
            x: 50,
            y: 120,
            width: 400,
            height: 150,
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
          {
            id: 'price-table',
            type: 'price-table',
            content: '',
            x: 50,
            y: 300,
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
      tags: ['varsayılan', 'temel'],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        compatibility: ['v1.0']
      },
      settings: {
        allowCustomization: true,
        maxElementsPerPage: 50,
        supportedLanguages: ['tr', 'en'],
        colorScheme: 'light'
      }
    };
  }

  /**
   * Şablonu kopyala
   */
  static cloneTemplate(template: PDFTemplate, newName: string): PDFTemplate {
    return {
      ...template,
      id: `template-${Date.now()}`,
      name: newName,
      isDefault: false,
      metadata: {
        ...template.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      }
    };
  }

  /**
   * Şablonu export et (JSON)
   */
  static exportTemplate(template: PDFTemplate): string {
    return JSON.stringify(template, null, 2);
  }

  /**
   * Şablonu import et (JSON)
   */
  static importTemplate(jsonString: string): PDFTemplate {
    try {
      const template = JSON.parse(jsonString);
      
      // Gerekli alanları kontrol et
      if (!template.name || !template.pages) {
        throw new Error('Geçersiz şablon formatı');
      }

      // ID'yi yenile
      template.id = `template-${Date.now()}`;
      template.metadata = {
        ...template.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      };

      return template;
    } catch (error) {
      throw new Error('Şablon import edilemedi: ' + (error as any).message);
    }
  }
} 