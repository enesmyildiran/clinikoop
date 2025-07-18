import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface OfferData {
  patient: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  treatments: Array<{
    name: string;
    teeth: number[];
    price: number;
    currency: string;
    notes?: string;
  }>;
  totalAmount: number;
  currency: string;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
  notes?: string;
  offerDate: string;
  validUntil: string;
}

export interface PDFTemplate {
  logo?: string;
  headerText: string;
  footerText: string;
  colorScheme: string;
  fontSize: string;
  showVAT: boolean;
  showLogo: boolean;
  showHeader: boolean;
  showFooter: boolean;
  pages?: Array<{
    id: string;
    width: number;
    height: number;
    elements: Array<{
      id: string;
      type: string;
      content: string;
      x: number;
      y: number;
      width: number;
      height: number;
      fontSize?: number;
      fontFamily?: string;
      color?: string;
      opacity?: number;
      alignment?: string;
      verticalAlignment?: string;
      rotation?: number;
      zIndex?: number;
      isVisible?: boolean;
      [key: string]: any;
    }>;
  }>;
}

export interface PDFSettings {
  clinicName?: string;
  clinicSlogan?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  clinicEmail?: string;
  clinicWebsite?: string;
  clinicTaxNumber?: string;
  clinicInstagram?: string;
  clinicFacebook?: string;
  clinicWhatsapp?: string;
  clinicLogo?: string;
  showLogo?: boolean;
  showVAT?: boolean;
  showSocialMedia?: boolean;
  showTaxNumber?: boolean;
  headerFont?: string;
  bodyFont?: string;
  fontSize?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  logoWidth?: string;
  logoHeight?: string;
}

export class PDFGenerator {
  private template: PDFTemplate;

  constructor(template: PDFTemplate) {
    this.template = template;
  }

  async generatePDF(offerData: any, pdfSettings?: PDFSettings): Promise<jsPDF> {
    try {
      // Önce veritabanından varsayılan şablonu al
      let templateContent = null;
      try {
        const response = await fetch('/api/pdf-templates?default=true');
        const data = await response.json();
        if (data.success && data.data) {
          templateContent = data.data.content;
        }
      } catch (error) {
        console.log('Varsayılan şablon alınamadı, eski sistem kullanılıyor');
      }

      // Eğer veritabanında şablon varsa, HTML tabanlı sistemi kullan
      if (templateContent) {
        // HTML şablonunu render et
        const renderedHtml = this.renderTemplate(templateContent, offerData);
        // HTML'i PDF'e çevir (bu fonksiyon ayrı bir dosyada olacak)
        return this.convertHtmlToPdf(renderedHtml);
      }

      // Eski jsPDF sistemi (fallback)
      return this.generateLegacyPDF(offerData, pdfSettings);
    } catch (error) {
      console.error('PDF oluşturulurken hata:', error);
      throw error;
    }
  }

  private renderTemplate(template: string, data: any): string {
    let html = template;
    html = html.replace(/{{clinic.name}}/g, data.clinic?.name || 'Klinik');
    html = html.replace(/{{patient.name}}/g, `${data.patient?.firstName || ''} ${data.patient?.lastName || ''}`.trim());
    html = html.replace(/{{patient.phone}}/g, data.patient?.phone || '');
    html = html.replace(/{{patient.email}}/g, data.patient?.email || '');
    html = html.replace(/{{offer.grandTotal}}/g, data.grandTotal || '0');
    html = html.replace(/{{offer.currency}}/g, data.currency || '₺');
    
    // treatments tablosu
    html = html.replace(/{{#each treatments}}([\s\S]*?){{\/each}}/, (_, row) => {
      if (!data.treatments || !Array.isArray(data.treatments)) return '';
      return data.treatments.map((t: any) =>
        row
          .replace(/{{name}}/g, t.name || '')
          .replace(/{{teeth}}/g, t.selectedTeeth || '')
          .replace(/{{price}}/g, t.price || '0')
      ).join("");
    });
    
    return html;
  }

  private async convertHtmlToPdf(html: string): Promise<jsPDF> {
    // Bu fonksiyon html2pdf.js kullanarak HTML'i PDF'e çevirecek
    // Şimdilik basit bir implementasyon
    const pdf = new jsPDF();
    pdf.setFontSize(12);
    pdf.text('HTML şablonu PDF\'e çevriliyor...', 20, 20);
    return pdf;
  }

  private generateLegacyPDF(offerData: any, pdfSettings?: PDFSettings): jsPDF {
    // Eski jsPDF sistemi buraya taşınacak
    const pdf = new jsPDF();
    // ... eski kod ...
    return pdf;
  }

  // Yeni şablon formatı için PDF oluşturma
  private async generatePDFFromTemplate(offerData: OfferData, pdf: jsPDF, pdfSettings?: PDFSettings): Promise<Blob> {
    try {
      console.log('=== generatePDFFromTemplate BAŞLATILIYOR ===');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      console.log('Sayfa boyutları:', { pageWidth, pageHeight });
      console.log('Şablon sayfaları:', this.template.pages);
      
      if (!this.template.pages || this.template.pages.length === 0) {
        throw new Error('Şablon sayfaları bulunamadı');
      }
      
      // Her sayfa için
      for (let pageIndex = 0; pageIndex < this.template.pages!.length; pageIndex++) {
        console.log(`Sayfa ${pageIndex + 1} işleniyor...`);
        
        if (pageIndex > 0) {
          pdf.addPage();
          console.log(`Yeni sayfa eklendi: ${pageIndex + 1}`);
        }
        
        const page = this.template.pages![pageIndex];
        console.log(`Sayfa ${pageIndex + 1} elementleri:`, page.elements.length);
        
        if (!page.elements || page.elements.length === 0) {
          console.log(`Sayfa ${pageIndex + 1} boş, devam ediliyor...`);
          continue;
        }
        
        // Sayfadaki her element için
        for (const element of page.elements) {
          if (!element.isVisible) {
            console.log(`Element ${element.id} görünür değil, atlanıyor`);
            continue;
          }
          
          console.log(`Element ${element.id} (${element.type}) render ediliyor...`);
          
          try {
            // Element pozisyonunu PDF koordinatlarına çevir
            const x = (element.x / page.width) * pageWidth;
            const y = (element.y / page.height) * pageHeight;
            const width = (element.width / page.width) * pageWidth;
            const height = (element.height / page.height) * pageHeight;
            
            console.log(`Element koordinatları:`, { x, y, width, height });
            
            await this.renderElement(pdf, element, x, y, width, height, offerData, pdfSettings);
            console.log(`Element ${element.id} başarıyla render edildi`);
          } catch (elementError) {
            console.error(`Element ${element.id} render hatası:`, elementError);
            // Element hatası durumunda devam et, tüm PDF'i durdurma
            continue;
          }
        }
      }
      
      console.log('generatePDFFromTemplate tamamlandı, blob oluşturuluyor...');
      const blob = pdf.output('blob');
      console.log('Template blob oluşturuldu:', blob);
      console.log('Template blob boyutu:', blob.size);
      console.log('Template blob tipi:', blob.type);
      
      if (!blob || blob.size === 0) {
        throw new Error('Template PDF blob oluşturulamadı');
      }
      
      return blob;
    } catch (error) {
      console.error('=== generatePDFFromTemplate HATASI ===');
      console.error('Hata detayı:', error);
      console.error('Hata mesajı:', (error as any).message);
      console.error('Hata stack:', (error as any).stack);
      
      let errorMessage = 'Template PDF oluşturulurken hata';
      
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage += `: ${error}`;
      }
      
      throw new Error(errorMessage);
    }
  }

  // Element render etme
  private async renderElement(
    pdf: jsPDF, 
    element: any, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    offerData: OfferData,
    pdfSettings?: PDFSettings
  ): Promise<void> {
    try {
      console.log(`=== renderElement: ${element.type} elementi render ediliyor ===`);
      console.log('Element detayları:', element);
      console.log('Koordinatlar:', { x, y, width, height });
      
      if (!element || !element.type) {
        throw new Error('Geçersiz element verisi');
      }
      
      switch (element.type) {
        case 'text':
          console.log('Text elementi render ediliyor...');
          this.renderTextElement(pdf, element, x, y, width, height, offerData, pdfSettings);
          break;
        case 'image':
        case 'logo':
          console.log('Image/Logo elementi render ediliyor...');
          await this.renderImageElement(pdf, element, x, y, width, height, pdfSettings);
          break;
        case 'patient-info':
          console.log('Patient-info elementi render ediliyor...');
          this.renderPatientInfoElement(pdf, element, x, y, width, height, offerData);
          break;
        case 'treatment-info':
          console.log('Treatment-info elementi render ediliyor...');
          this.renderTreatmentInfoElement(pdf, element, x, y, width, height, offerData);
          break;
        case 'price-table':
          console.log('Price-table elementi render ediliyor...');
          this.renderPriceTableElement(pdf, element, x, y, width, height, offerData);
          break;
        default:
          console.log(`Bilinmeyen element tipi: ${element.type}, varsayılan text render kullanılıyor`);
          // Varsayılan text render
          this.renderTextElement(pdf, element, x, y, width, height, offerData, pdfSettings);
      }
      
      console.log(`renderElement: ${element.type} elementi başarıyla render edildi`);
    } catch (error) {
      console.error(`=== renderElement HATASI (${element.type}) ===`);
      console.error('Element detayları:', element);
      console.error('Koordinatlar:', { x, y, width, height });
      console.error('Hata detayı:', error);
      console.error('Hata mesajı:', (error as any).message);
      console.error('Hata stack:', (error as any).stack);
      
      let errorMessage = `${element.type} elementi render edilirken hata`;
      
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage += `: ${error}`;
      }
      
      throw new Error(errorMessage);
    }
  }

  private renderTextElement(
    pdf: jsPDF, 
    element: any, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    offerData: OfferData,
    pdfSettings?: PDFSettings
  ): void {
    try {
      console.log('=== renderTextElement başlatılıyor ===');
      console.log('Element:', element);
      console.log('Koordinatlar:', { x, y, width, height });
      
      // Font ayarları - PDF ayarlarından al veya varsayılan kullan
      const fontSize = element.fontSize || parseInt(pdfSettings?.fontSize || '12');
      const fontFamily = element.fontFamily || pdfSettings?.headerFont || 'helvetica';
      const color = element.color || pdfSettings?.textColor || '#000000';
      
      console.log('Font ayarları:', { fontSize, fontFamily, color });
      console.log('PDF ayarları:', pdfSettings);
      
      pdf.setFontSize(fontSize);
      
      // Font ailesini ayarla
      let pdfFontFamily = 'helvetica'; // jsPDF varsayılan fontları
      if (fontFamily) {
        const fontLower = fontFamily.toLowerCase();
        if (fontLower.includes('arial') || fontLower.includes('helvetica')) {
          pdfFontFamily = 'helvetica';
        } else if (fontLower.includes('times') || fontLower.includes('georgia')) {
          pdfFontFamily = 'times';
        } else if (fontLower.includes('courier') || fontLower.includes('mono')) {
          pdfFontFamily = 'courier';
        } else {
          pdfFontFamily = 'helvetica'; // Varsayılan
        }
      }
      
      pdf.setFont(pdfFontFamily, 'normal');
      console.log('PDF font ayarlandı:', pdfFontFamily);
      
      // Renk ayarla
      const rgb = this.hexToRgb(color);
      if (rgb) {
        pdf.setTextColor(rgb.r, rgb.g, rgb.b);
        console.log('Renk ayarlandı:', rgb);
      } else {
        console.log('Renk ayarlanamadı, varsayılan siyah kullanılıyor');
        pdf.setTextColor(0, 0, 0);
      }
      
      // Hizalama
      const align = element.alignment || 'left';
      console.log('Hizalama:', align);
      
      // İçeriği dinamik olarak değiştir
      let content = element.content || '';
      console.log('Orijinal içerik:', content);
      
      content = this.replaceDynamicContent(content, offerData, pdfSettings);
      console.log('Dinamik içerik:', content);
      
      if (!content || content.trim() === '') {
        console.log('Boş içerik, text render edilmiyor');
        return;
      }
      
      // Text'i render et
      pdf.text(content, x, y, { align });
      console.log('Text başarıyla render edildi');
      
    } catch (error) {
      console.error('=== renderTextElement HATASI ===');
      console.error('Element:', element);
      console.error('Koordinatlar:', { x, y, width, height });
      console.error('Hata detayı:', error);
      console.error('Hata mesajı:', (error as any).message);
      console.error('Hata stack:', (error as any).stack);
      
      let errorMessage = 'Text elementi render edilirken hata';
      
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage += `: ${error}`;
      }
      
      throw new Error(errorMessage);
    }
  }

  private async renderImageElement(
    pdf: jsPDF, 
    element: any, 
    x: number, 
    y: number, 
    width: number, 
    height: number,
    pdfSettings?: PDFSettings
  ): Promise<void> {
    try {
      console.log('=== renderImageElement başlatılıyor ===');
      console.log('Element:', element);
      console.log('Koordinatlar:', { x, y, width, height });
      
      let imageUrl = element.content;
      
      // Logo placeholder'larını gerçek URL'lere çevir
      if (imageUrl && typeof imageUrl === 'string') {
        if (imageUrl.includes('{{clinic.logo}}')) {
          // PDF ayarlarından logo URL'sini al
          const logoUrl = pdfSettings?.clinicLogo;
          if (logoUrl && logoUrl.trim() !== '') {
            imageUrl = logoUrl;
            console.log('Logo URL ayarlardan alındı:', imageUrl);
          } else {
            // Varsayılan logo URL'si oluştur
            const clinicName = pdfSettings?.clinicName || 'Clinikoop';
            imageUrl = `https://via.placeholder.com/120x60/2563eb/ffffff?text=${encodeURIComponent(clinicName)}`;
            console.log('Varsayılan logo URL\'si oluşturuldu:', imageUrl);
          }
        }
        
        // Diğer placeholder'ları da kontrol et
        imageUrl = this.replaceDynamicContent(imageUrl, {
          patient: { firstName: '', lastName: '', phone: '', email: '' },
          treatments: [],
          totalAmount: 0,
          currency: 'TRY',
          vatRate: 0,
          vatAmount: 0,
          grandTotal: 0,
          notes: '',
          offerDate: '',
          validUntil: ''
        }, pdfSettings);
      }
      
      if (!imageUrl || imageUrl.trim() === '') {
        console.log('Geçersiz resim URL\'si, element atlanıyor');
        return;
      }
      
      console.log('Resim URL\'si:', imageUrl);
      
      // Resmi yükle
      const img = new Image();
      img.crossOrigin = 'anonymous'; // CORS sorunlarını önle
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          console.log('Resim başarıyla yüklendi');
          resolve(true);
        };
        img.onerror = (error) => {
          console.error('Resim yükleme hatası:', error);
          reject(new Error('Resim yüklenemedi'));
        };
        img.src = imageUrl;
      });
      
      // PDF'e ekle
      pdf.addImage(img, 'PNG', x, y, width, height);
      console.log('Resim PDF\'e eklendi');
      
    } catch (error) {
      console.error('=== renderImageElement HATASI ===');
      console.error('Element:', element);
      console.error('Koordinatlar:', { x, y, width, height });
      console.error('Hata detayı:', error);
      console.error('Hata mesajı:', (error as any).message);
      console.error('Hata stack:', (error as any).stack);
      
      // Resim yüklenemezse varsayılan bir placeholder ekle
      try {
        console.log('Varsayılan placeholder ekleniyor...');
        const placeholderUrl = 'https://via.placeholder.com/120x60/cccccc/666666?text=LOGO';
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = placeholderUrl;
        });
        
        pdf.addImage(img, 'PNG', x, y, width, height);
        console.log('Varsayılan placeholder eklendi');
      } catch (placeholderError) {
        console.error('Varsayılan placeholder da eklenemedi:', placeholderError);
        // Resim elementi tamamen atla
      }
    }
  }

  private renderPatientInfoElement(
    pdf: jsPDF, 
    element: any, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    offerData: OfferData
  ): void {
    const titleText = element.titleText || 'Hasta Bilgileri';
    const titleFontSize = element.titleFontSize || 16;
    const contentFontSize = element.contentFontSize || 12;
    
    // Başlık
    pdf.setFontSize(titleFontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(titleText, x, y);
    
    // İçerik
    pdf.setFontSize(contentFontSize);
    pdf.setFont('helvetica', 'normal');
    
    let currentY = y + 8;
    
    // Hasta bilgileri
    pdf.text(this.replaceDynamicContent(`Ad Soyad: ${offerData.patient.firstName} ${offerData.patient.lastName}`), x, currentY);
    currentY += 6;
    pdf.text(this.replaceDynamicContent(`Telefon: ${offerData.patient.phone}`), x, currentY);
    currentY += 6;
    pdf.text(this.replaceDynamicContent(`E-posta: ${offerData.patient.email}`), x, currentY);
    currentY += 6;
    pdf.text(this.replaceDynamicContent(`Teklif Tarihi: ${offerData.offerDate}`), x, currentY);
    currentY += 6;
    pdf.text(this.replaceDynamicContent(`Geçerlilik: ${offerData.validUntil}`), x, currentY);
  }

  private renderTreatmentInfoElement(
    pdf: jsPDF, 
    element: any, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    offerData: OfferData
  ): void {
    const titleText = element.titleText || 'Tedavi Bilgileri';
    const titleFontSize = element.titleFontSize || 16;
    const contentFontSize = element.contentFontSize || 12;
    
    // Başlık
    pdf.setFontSize(titleFontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(titleText, x, y);
    
    // İçerik
    pdf.setFontSize(contentFontSize);
    pdf.setFont('helvetica', 'normal');
    
    let currentY = y + 8;
    
    // Tedavi listesi
    offerData.treatments.forEach((treatment, index) => {
      pdf.text(this.replaceDynamicContent(`${index + 1}. ${treatment.name}`), x, currentY);
      currentY += 5;
      
      if (treatment.teeth && treatment.teeth.length > 0) {
        pdf.text(this.replaceDynamicContent(`   Dişler: ${treatment.teeth.join(', ')}`), x, currentY);
        currentY += 5;
      }
      
      if (treatment.notes) {
        pdf.text(this.replaceDynamicContent(`   Not: ${treatment.notes}`), x, currentY);
        currentY += 5;
      }
    });
  }

  private renderPriceTableElement(
    pdf: jsPDF, 
    element: any, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    offerData: OfferData
  ): void {
    const titleText = element.titleText || 'Fiyat Tablosu';
    const titleFontSize = element.titleFontSize || 16;
    const contentFontSize = element.contentFontSize || 12;
    
    // Başlık
    pdf.setFontSize(titleFontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(titleText, x, y);
    
    // Tablo başlığı
    pdf.setFontSize(contentFontSize);
    pdf.setFont('helvetica', 'bold');
    
    let currentY = y + 8;
    const colWidth = width / 3;
    
    pdf.text('Tedavi', x, currentY);
    pdf.text('Dişler', x + colWidth, currentY);
    pdf.text('Fiyat', x + colWidth * 2, currentY);
    
    currentY += 6;
    
    // Tablo içeriği
    pdf.setFont('helvetica', 'normal');
    
    offerData.treatments.forEach((treatment, index) => {
      pdf.text(this.replaceDynamicContent(treatment.name), x, currentY);
      pdf.text(this.replaceDynamicContent(treatment.teeth.join(', ')), x + colWidth, currentY);
      pdf.text(this.replaceDynamicContent(`${(Math.round(treatment.price * 100) / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${treatment.currency}`), x + colWidth * 2, currentY);
      currentY += 5;
    });
    
    // Toplamlar
    currentY += 3;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Ara Toplam:', x + colWidth, currentY);
    pdf.text(this.replaceDynamicContent(`${offerData.totalAmount.toLocaleString('tr-TR')} ${offerData.currency}`), x + colWidth * 2, currentY);
    currentY += 5;
    
    pdf.text(`KDV (${offerData.vatRate}%):`, x + colWidth, currentY);
    pdf.text(this.replaceDynamicContent(`${offerData.vatAmount.toLocaleString('tr-TR')} ${offerData.currency}`), x + colWidth * 2, currentY);
    currentY += 5;
    
    pdf.setFontSize(contentFontSize + 2);
    pdf.text('Genel Toplam:', x + colWidth, currentY);
    pdf.text(this.replaceDynamicContent(`${offerData.grandTotal.toLocaleString('tr-TR')} ${offerData.currency}`), x + colWidth * 2, currentY);
  }

  private replaceDynamicContent(content: string, offerData: OfferData, pdfSettings?: PDFSettings): string {
    try {
      console.log('=== replaceDynamicContent başlatılıyor ===');
      console.log('Orijinal içerik:', content);
      console.log('Offer data:', offerData);
      console.log('PDF settings:', pdfSettings);
      
      if (!content || typeof content !== 'string') {
        console.log('Geçersiz içerik, boş string döndürülüyor');
        return '';
      }
      
      let result = content
        // Hasta bilgileri
        .replace(/\{\{patient\.firstName\}\}/g, offerData.patient.firstName || '')
        .replace(/\{\{patient\.lastName\}\}/g, offerData.patient.lastName || '')
        .replace(/\{\{patient\.phone\}\}/g, offerData.patient.phone || '')
        .replace(/\{\{patient\.email\}\}/g, offerData.patient.email || '')
        // Teklif bilgileri
        .replace(/\{\{totalAmount\}\}/g, (Math.round((offerData.totalAmount || 0) * 100) / 100).toLocaleString('tr-TR'))
        .replace(/\{\{currency\}\}/g, offerData.currency || '')
        .replace(/\{\{offerDate\}\}/g, offerData.offerDate || '')
        .replace(/\{\{validUntil\}\}/g, offerData.validUntil || '')
        .replace(/\{\{vatRate\}\}/g, (offerData.vatRate || 0).toString())
        .replace(/\{\{vatAmount\}\}/g, (Math.round((offerData.vatAmount || 0) * 100) / 100).toLocaleString('tr-TR'))
        .replace(/\{\{grandTotal\}\}/g, (Math.round((offerData.grandTotal || 0) * 100) / 100).toLocaleString('tr-TR'));

      console.log('Temel değişiklikler yapıldı:', result);

      // PDF ayarları varsa onları da ekle
      if (pdfSettings) {
        result = result
          .replace(/\{\{settings\.pdf\.clinicName\}\}/g, pdfSettings.clinicName || '')
          .replace(/\{\{settings\.pdf\.clinicSlogan\}\}/g, pdfSettings.clinicSlogan || '')
          .replace(/\{\{settings\.pdf\.clinicAddress\}\}/g, pdfSettings.clinicAddress || '')
          .replace(/\{\{settings\.pdf\.clinicPhone\}\}/g, pdfSettings.clinicPhone || '')
          .replace(/\{\{settings\.pdf\.clinicEmail\}\}/g, pdfSettings.clinicEmail || '')
          .replace(/\{\{settings\.pdf\.clinicWebsite\}\}/g, pdfSettings.clinicWebsite || '')
          .replace(/\{\{settings\.pdf\.clinicTaxNumber\}\}/g, pdfSettings.clinicTaxNumber || '')
          .replace(/\{\{settings\.pdf\.clinicInstagram\}\}/g, pdfSettings.clinicInstagram || '')
          .replace(/\{\{settings\.pdf\.clinicFacebook\}\}/g, pdfSettings.clinicFacebook || '')
          .replace(/\{\{settings\.pdf\.clinicWhatsapp\}\}/g, pdfSettings.clinicWhatsapp || '')
          // Genel ayarlar
          .replace(/\{\{settings\.general\.clinicName\}\}/g, pdfSettings.clinicName || '')
          .replace(/\{\{settings\.general\.clinicEmail\}\}/g, pdfSettings.clinicEmail || '')
          .replace(/\{\{settings\.general\.clinicPhone\}\}/g, pdfSettings.clinicPhone || '')
          .replace(/\{\{settings\.general\.clinicAddress\}\}/g, pdfSettings.clinicAddress || '')
          // Kısa formlar
          .replace(/\{\{clinic\.name\}\}/g, pdfSettings.clinicName || '')
          .replace(/\{\{clinic\.slogan\}\}/g, pdfSettings.clinicSlogan || '')
          .replace(/\{\{clinic\.address\}\}/g, pdfSettings.clinicAddress || '')
          .replace(/\{\{clinic\.phone\}\}/g, pdfSettings.clinicPhone || '')
          .replace(/\{\{clinic\.email\}\}/g, pdfSettings.clinicEmail || '')
          .replace(/\{\{clinic\.website\}\}/g, pdfSettings.clinicWebsite || '')
          .replace(/\{\{clinic\.taxNumber\}\}/g, pdfSettings.clinicTaxNumber || '')
          .replace(/\{\{clinic\.logo\}\}/g, pdfSettings.clinicLogo || '');
        
        console.log('PDF ayarları değişiklikleri yapıldı:', result);
      }

      console.log('Final sonuç:', result);
      return result;
      
    } catch (error) {
      console.error('=== replaceDynamicContent HATASI ===');
      console.error('Orijinal içerik:', content);
      console.error('Offer data:', offerData);
      console.error('PDF settings:', pdfSettings);
      console.error('Hata detayı:', error);
      console.error('Hata mesajı:', (error as any).message);
      console.error('Hata stack:', (error as any).stack);
      
      // Hata durumunda orijinal içeriği döndür
      return content || '';
    }
  }

  // Hex renk kodunu RGB'ye çevir
  private hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private addHeader(pdf: jsPDF, yPosition: number, pageWidth: number, margin: number, pdfSettings?: PDFSettings): number {
    pdf.setFont('helvetica', 'normal'); // Türkçe karakter desteği için
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246); // Blue color
    const headerText = this.replaceDynamicContent(pdfSettings?.clinicName || this.template.headerText, undefined, pdfSettings);
    pdf.text(headerText, pageWidth / 2, yPosition, { align: 'center' });
    if (pdfSettings?.clinicSlogan) {
      pdf.setFontSize(12);
      pdf.setTextColor(107, 114, 128);
      pdf.text(this.replaceDynamicContent(pdfSettings.clinicSlogan, undefined, pdfSettings), pageWidth / 2, yPosition + 8, { align: 'center' });
      return yPosition + 20;
    }
    return yPosition + 15;
  }

  private async addLogo(pdf: jsPDF, yPosition: number, pageWidth: number, margin: number, pdfSettings?: PDFSettings): Promise<number> {
    try {
      // Logo URL'si varsa onu kullan, yoksa varsayılan logo
      const logoUrl = pdfSettings?.clinicLogo;
      
      if (logoUrl) {
        const img = new Image();
        img.src = logoUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        const logoWidth = 40;
        const logoHeight = 20;
        pdf.addImage(img, 'PNG', margin, yPosition, logoWidth, logoHeight);
        return yPosition + logoHeight + 10;
      }
    } catch (error) {
      console.error('Logo yüklenirken hata:', error);
    }
    return yPosition;
  }

  private addPatientInfo(pdf: jsPDF, offerData: OfferData, yPosition: number, pageWidth: number, margin: number): number {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Hasta Bilgileri', margin, yPosition);
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.text(this.replaceDynamicContent(`Ad Soyad: ${offerData.patient.firstName} ${offerData.patient.lastName}`), margin, yPosition);
    yPosition += 7;
    pdf.text(this.replaceDynamicContent(`Telefon: ${offerData.patient.phone}`), margin, yPosition);
    yPosition += 7;
    pdf.text(this.replaceDynamicContent(`E-posta: ${offerData.patient.email}`), margin, yPosition);
    yPosition += 7;
    pdf.text(this.replaceDynamicContent(`Teklif Tarihi: ${offerData.offerDate}`), margin, yPosition);
    yPosition += 7;
    pdf.text(this.replaceDynamicContent(`Geçerlilik: ${offerData.validUntil}`), margin, yPosition);
    return yPosition + 15;
  }

  private addOfferDetails(pdf: jsPDF, offerData: OfferData, yPosition: number, pageWidth: number, margin: number): number {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Teklif Detayları', margin, yPosition);
    return yPosition + 10;
  }

  private addTreatmentsTable(pdf: jsPDF, offerData: OfferData, yPosition: number, pageWidth: number, margin: number): number {
    const tableWidth = pageWidth - 2 * margin;
    const colWidths = [tableWidth * 0.4, tableWidth * 0.3, tableWidth * 0.3];
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(59, 130, 246);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    let x = margin;
    pdf.rect(x, yPosition - 5, colWidths[0], 8, 'F');
    pdf.text('Tedavi', x + 2, yPosition);
    x += colWidths[0];
    pdf.rect(x, yPosition - 5, colWidths[1], 8, 'F');
    pdf.text('Dişler', x + 2, yPosition);
    x += colWidths[1];
    pdf.rect(x, yPosition - 5, colWidths[2], 8, 'F');
    pdf.text('Fiyat', x + 2, yPosition);
    yPosition += 8;
    pdf.setFont('helvetica', 'normal');
    pdf.setFillColor(248, 250, 252);
    pdf.setTextColor(0, 0, 0);
    offerData.treatments.forEach((treatment, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      const fillColor = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
      pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      let x = margin;
      pdf.rect(x, yPosition - 5, colWidths[0], 8, 'F');
      pdf.text(this.replaceDynamicContent(treatment.name), x + 2, yPosition);
      x += colWidths[0];
      pdf.rect(x, yPosition - 5, colWidths[1], 8, 'F');
      pdf.text(this.replaceDynamicContent(treatment.teeth.join(', ')), x + 2, yPosition);
      x += colWidths[1];
      pdf.rect(x, yPosition - 5, colWidths[2], 8, 'F');
      pdf.text(this.replaceDynamicContent(`${treatment.price.toLocaleString('tr-TR')} ${treatment.currency}`), x + 2, yPosition);
      yPosition += 8;
    });
    return yPosition + 10;
  }

  private addTotals(pdf: jsPDF, offerData: OfferData, yPosition: number, pageWidth: number, margin: number, pdfSettings?: PDFSettings): number {
    const rightAlign = pageWidth - margin;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Ara Toplam:', rightAlign - 50, yPosition);
    pdf.text(this.replaceDynamicContent(`${offerData.totalAmount.toLocaleString('tr-TR')} ${offerData.currency}`), rightAlign, yPosition, { align: 'right' });
    yPosition += 7;
    if ((pdfSettings?.showVAT !== false) && this.template.showVAT) {
      pdf.text(`KDV (${offerData.vatRate}%):`, rightAlign - 50, yPosition);
      pdf.text(this.replaceDynamicContent(`${offerData.vatAmount.toLocaleString('tr-TR')} ${offerData.currency}`), rightAlign, yPosition, { align: 'right' });
      yPosition += 7;
    }
    pdf.setFontSize(14);
    pdf.text('Genel Toplam:', rightAlign - 50, yPosition);
    pdf.text(this.replaceDynamicContent(`${offerData.grandTotal.toLocaleString('tr-TR')} ${offerData.currency}`), rightAlign, yPosition, { align: 'right' });
    return yPosition + 15;
  }

  private addNotes(pdf: jsPDF, notes: string, yPosition: number, pageWidth: number, margin: number): number {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Notlar:', margin, yPosition);
    yPosition += 7;
    pdf.setFont('helvetica', 'normal');
    const lines = this.splitTextToSize(this.replaceDynamicContent(notes), pageWidth - 2 * margin, pdf);
    lines.forEach(line => {
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    });
    return yPosition + 10;
  }

  private addFooter(pdf: jsPDF, pageHeight: number, pageWidth: number, margin: number, pdfSettings?: PDFSettings): void {
    const footerY = pageHeight - 15;
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    
    // Klinik bilgileri
    if (pdfSettings?.clinicAddress) {
      pdf.text(pdfSettings.clinicAddress, pageWidth / 2, footerY - 8, { align: 'center' });
    }
    
    // İletişim bilgileri
    const contactInfo = [];
    if (pdfSettings?.clinicPhone) contactInfo.push(`Tel: ${pdfSettings.clinicPhone}`);
    if (pdfSettings?.clinicEmail) contactInfo.push(`E-posta: ${pdfSettings.clinicEmail}`);
    
    if (contactInfo.length > 0) {
      pdf.text(contactInfo.join(' | '), pageWidth / 2, footerY - 4, { align: 'center' });
    }
    
    // Footer metni
    pdf.text(this.template.footerText, pageWidth / 2, footerY, { align: 'center' });
  }

  private splitTextToSize(text: string, maxWidth: number, pdf: jsPDF): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = pdf.getTextWidth(testLine);
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }
}

export async function generatePDFFromHTML(element: HTMLElement, filename: string = 'offer.pdf'): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('HTML to PDF conversion error:', error);
    throw error;
  }
} 