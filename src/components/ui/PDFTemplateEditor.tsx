"use client"

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { useToast } from './Toast';
import { 
  Upload, 
  Type, 
  Image, 
  Plus, 
  Trash2, 
  Move, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Eye,
  EyeOff,
  Layers,
  Settings,
  Save,
  Download,
  ChevronUp,
  ChevronDown,
  Minus,
  FileText,
  Table,
  DollarSign,
  User,
  Stethoscope
} from 'lucide-react';

export interface PriceTableItem {
  id: string;
  treatment: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
}

export interface PDFElement {
  id: string;
  type: 'text' | 'image' | 'logo' | 'price-table' | 'patient-info' | 'treatment-info';
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
  // Fiyat tablosu için ek özellikler
  priceTableData?: PriceTableItem[];
  showVAT?: boolean;
  vatRate?: number;
  currency?: string;
  // Hasta bilgileri için ek özellikler
  patientData?: {
    name?: string;
    age?: number;
    phone?: string;
    email?: string;
    address?: string;
    diagnosis?: string;
    notes?: string;
  };
  // Tedavi bilgileri için ek özellikler
  treatmentData?: {
    treatments?: string[];
    recommendations?: string;
    nextAppointment?: string;
    doctor?: string;
  };
  // Hasta bilgileri için görünürlük ayarları
  patientFieldsVisibility?: Partial<{
    name: boolean;
    age: boolean;
    phone: boolean;
    email: boolean;
    address: boolean;
    diagnosis: boolean;
    notes: boolean;
  }>;
  // Tedavi bilgileri için görünürlük ayarları
  treatmentFieldsVisibility?: Partial<{
    treatments: boolean;
    recommendations: boolean;
    nextAppointment: boolean;
    doctor: boolean;
  }>;
}

export interface PDFPage {
  id: string;
  elements: PDFElement[];
  backgroundColor?: string;
  width: number;
  height: number;
}

export interface PDFTemplate {
  id: string;
  name: string;
  pages: PDFPage[];
  defaultPageSize: 'a4' | 'letter' | 'legal';
}

interface PDFTemplateEditorProps {
  template?: PDFTemplate;
  onSave?: (template: PDFTemplate) => void;
  onExport?: (template: PDFTemplate) => void;
}

export const PDFTemplateEditor: React.FC<PDFTemplateEditorProps> = ({
  template,
  onSave,
  onExport
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<PDFTemplate>(
    template || {
      id: '1',
      name: 'Yeni Şablon',
      pages: [{
        id: '1',
        elements: [],
        width: 794,
        height: 1123
      }],
      defaultPageSize: 'a4'
    }
  );
  
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<PDFElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [isHtmlEditMode, setIsHtmlEditMode] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const currentPage = currentTemplate.pages[currentPageIndex];

  // Element oluşturma fonksiyonları
  const createTextElement = () => {
    const newElement: PDFElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Yeni Metin',
      x: 50,
      y: 50,
      width: 200,
      height: 30,
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#000000',
      opacity: 1,
      alignment: 'left',
      verticalAlignment: 'top',
      rotation: 0,
      zIndex: 1,
      isVisible: true
    };
    
    addElementToCurrentPage(newElement);
  };

  const createImageElement = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newElement: PDFElement = {
            id: `image-${Date.now()}`,
            type: 'image',
            content: e.target?.result as string,
            x: 50,
            y: 50,
            width: 200,
            height: 150,
            opacity: 1,
            rotation: 0,
            zIndex: 1,
            isVisible: true
          };
          addElementToCurrentPage(newElement);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const createLogoElement = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newElement: PDFElement = {
            id: `logo-${Date.now()}`,
            type: 'logo',
            content: e.target?.result as string,
            x: 50,
            y: 50,
            width: 120,
            height: 60,
            opacity: 1,
            rotation: 0,
            zIndex: 1,
            isVisible: true
          };
          addElementToCurrentPage(newElement);
        };
        reader.readAsDataURL(file);
      } else {
        const newElement: PDFElement = {
          id: `logo-${Date.now()}`,
          type: 'logo',
          content: '',
          x: 50,
          y: 50,
          width: 120,
          height: 60,
          opacity: 1,
          rotation: 0,
          zIndex: 1,
          isVisible: true
        };
        addElementToCurrentPage(newElement);
      }
    };
    input.click();
  };

  const createPatientInfoElement = () => {
    const newElement: PDFElement = {
      id: `patient-info-${Date.now()}`,
      type: 'patient-info',
      content: 'Hasta Bilgileri',
      x: 50,
      y: 50,
      width: 300,
      height: 200,
      fontSize: 14,
      fontFamily: 'Arial',
      color: '#000000',
      opacity: 1,
      alignment: 'left',
      verticalAlignment: 'top',
      rotation: 0,
      zIndex: 1,
      isVisible: true,
      patientData: {
        name: 'Hasta Adı',
        age: 30,
        phone: '+90 532 000 0000',
        email: 'hasta@email.com',
        address: 'Hasta Adresi',
        diagnosis: 'Teşhis',
        notes: 'Notlar'
      },
      patientFieldsVisibility: {
        name: true,
        age: true,
        phone: true,
        email: true,
        address: true,
        diagnosis: true,
        notes: true
      }
    };
    
    addElementToCurrentPage(newElement);
  };

  const createTreatmentInfoElement = () => {
    const newElement: PDFElement = {
      id: `treatment-info-${Date.now()}`,
      type: 'treatment-info',
      content: 'Tedavi Bilgileri',
      x: 50,
      y: 300,
      width: 300,
      height: 200,
      fontSize: 14,
      fontFamily: 'Arial',
      color: '#000000',
      opacity: 1,
      alignment: 'left',
      verticalAlignment: 'top',
      rotation: 0,
      zIndex: 1,
      isVisible: true,
      treatmentData: {
        treatments: ['Tedavi 1', 'Tedavi 2'],
        recommendations: 'Öneriler',
        nextAppointment: '2024-01-15',
        doctor: 'Dr. Ahmet Yılmaz'
      },
      treatmentFieldsVisibility: {
        treatments: true,
        recommendations: true,
        nextAppointment: true,
        doctor: true
      }
    };
    
    addElementToCurrentPage(newElement);
  };

  const createPriceTableElement = () => {
    const newElement: PDFElement = {
      id: `price-table-${Date.now()}`,
      type: 'price-table',
      content: 'Fiyat Tablosu',
      x: 50,
      y: 550,
      width: 500,
      height: 300,
      fontSize: 12,
      fontFamily: 'Arial',
      color: '#000000',
      opacity: 1,
      alignment: 'left',
      verticalAlignment: 'top',
      rotation: 0,
      zIndex: 1,
      isVisible: true,
      priceTableData: [
        {
          id: '1',
          treatment: 'Zirconium Crown',
          description: 'Ön dişler için',
          price: 1500,
          quantity: 1,
          total: 1500
        },
        {
          id: '2',
          treatment: 'Dental Implant',
          description: 'Tek implant',
          price: 3000,
          quantity: 1,
          total: 3000
        }
      ],
      showVAT: true,
      vatRate: 20,
      currency: 'TRY'
    };
    
    addElementToCurrentPage(newElement);
  };

  const addElementToCurrentPage = (element: PDFElement) => {
    const updatedPages = [...currentTemplate.pages];
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      elements: [...updatedPages[currentPageIndex].elements, element]
    };
    
    setCurrentTemplate({
      ...currentTemplate,
      pages: updatedPages
    });
    
    setSelectedElement(element);
  };

  // Element düzenleme
  const updateElement = (elementId: string, updates: Partial<PDFElement>) => {
    const updatedPages = [...currentTemplate.pages];
    const page = updatedPages[currentPageIndex];
    
    page.elements = page.elements.map(element =>
      element.id === elementId ? { ...element, ...updates } : element
    );
    
    setCurrentTemplate({
      ...currentTemplate,
      pages: updatedPages
    });
    
    if (selectedElement?.id === elementId) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
  };

  const deleteElement = (elementId: string) => {
    const updatedPages = [...currentTemplate.pages];
    const page = updatedPages[currentPageIndex];
    
    page.elements = page.elements.filter(element => element.id !== elementId);
    
    setCurrentTemplate({
      ...currentTemplate,
      pages: updatedPages
    });
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const element = currentPage.elements.find(el => 
      target.closest(`[data-element-id="${el.id}"]`)
    );
    
    if (element) {
      setIsDragging(true);
      setSelectedElement(element);
      const rect = target.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedElement) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const newX = e.clientX - rect.left - dragOffset.x;
        const newY = e.clientY - rect.top - dragOffset.y;
        updateElement(selectedElement.id, { x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Sayfa yönetimi fonksiyonları
  const addPage = () => {
    const newPage: PDFPage = {
      id: `page-${Date.now()}`,
      elements: [],
      width: 794,
      height: 1123
    };
    
    setCurrentTemplate(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
    
    // Yeni sayfaya geç
    setCurrentPageIndex(currentTemplate.pages.length);
  };

  const deletePage = (pageIndex: number) => {
    if (currentTemplate.pages.length <= 1) {
      addToast({
        message: 'En az bir sayfa olmalıdır',
        type: 'error'
      });
      return;
    }

    setCurrentTemplate(prev => ({
      ...prev,
      pages: prev.pages.filter((_, index) => index !== pageIndex)
    }));

    // Eğer silinen sayfa mevcut sayfaysa, önceki sayfaya geç
    if (pageIndex === currentPageIndex) {
      setCurrentPageIndex(Math.max(0, pageIndex - 1));
    } else if (pageIndex < currentPageIndex) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const duplicatePage = (pageIndex: number) => {
    const pageToDuplicate = currentTemplate.pages[pageIndex];
    const newPage: PDFPage = {
      ...pageToDuplicate,
      id: `page-${Date.now()}`,
      elements: pageToDuplicate.elements.map(element => ({
        ...element,
        id: `${element.id}-copy-${Date.now()}`
      }))
    };

    setCurrentTemplate(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
  };

  // Element özelliklerini güncelleme fonksiyonunu düzelt
  const updateElementProperty = (elementId: string, property: string, value: any) => {
    const element = currentPage.elements.find(el => el.id === elementId);
    if (!element) return;

    // Nested object güncellemeleri için (örn: patientFieldsVisibility.name)
    if (property.includes('.')) {
      const [parentProp, childProp] = property.split('.');
      const parentValue = (element as any)[parentProp] || {};
      
      updateElement(elementId, {
        [parentProp]: {
          ...parentValue,
          [childProp]: value
        }
      });
    } else {
      updateElement(elementId, { [property]: value });
    }
  };

  // HTML düzenleme modunu aç/kapat - hatayı düzelt
  const toggleHtmlEditMode = (elementId: string) => {
    if (selectedElement?.id === elementId) {
      setIsHtmlEditMode(!isHtmlEditMode);
    }
  };

  // HTML içeriği güvenli şekilde güncelle
  const updateElementContent = (elementId: string, content: string, isHtml: boolean = false) => {
    if (isHtml) {
      updateElementProperty(elementId, 'content', content);
    } else {
      // HTML tag'lerini temizle
      const cleanContent = content.replace(/<[^>]+>/g, '');
      updateElementProperty(elementId, 'content', cleanContent);
    }
  };

  // Element silme fonksiyonu
  const handleDeleteElement = (elementId: string) => {
    if (confirm('Bu elementi silmek istediğinize emin misiniz?')) {
      deleteElement(elementId);
      setSelectedElement(null);
      addToast({
        message: 'Element başarıyla silindi',
        type: 'success'
      });
    }
  };

  // Özellikler panelini açan buton
  const PropertiesPanelOpener = () => (
    !showProperties && selectedElement ? (
      <button
        onClick={() => setShowProperties(true)}
        className="fixed right-8 bottom-8 z-50 bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-blue-700 transition"
        title="Özellikler Panelini Aç"
      >
        <Settings className="w-7 h-7" />
      </button>
    ) : null
  );

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowToolbar(!showToolbar)}
            >
              {showToolbar ? 'Toolbar Gizle' : 'Toolbar Göster'}
            </Button>
            
            {/* Sayfa Yönetimi */}
            {showToolbar && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-600">Sayfa:</span>
                <select
                  value={currentPageIndex}
                  onChange={(e) => setCurrentPageIndex(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {currentTemplate.pages.map((page, index) => (
                    <option key={page.id} value={index}>
                      Sayfa {index + 1}
                    </option>
                  ))}
                </select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addPage}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Sayfa Ekle
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => duplicatePage(currentPageIndex)}
                  className="flex items-center gap-1"
                >
                  <Layers className="w-4 h-4" />
                  Kopyala
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deletePage(currentPageIndex)}
                  className="flex items-center gap-1 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Sil
                </Button>
              </div>
            )}
          </div>

          {showToolbar && (
            <div className="flex items-center gap-2">
              {/* Element Ekleme Butonları */}
              <Button
                variant="outline"
                size="sm"
                onClick={createTextElement}
                className="flex items-center gap-1"
              >
                <Type className="w-4 h-4" />
                Metin
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={createImageElement}
                className="flex items-center gap-1"
              >
                <Image className="w-4 h-4" />
                Resim
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={createLogoElement}
                className="flex items-center gap-1"
              >
                <Upload className="w-4 h-4" />
                Logo
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={createPatientInfoElement}
                className="flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                Hasta Bilgileri
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={createTreatmentInfoElement}
                className="flex items-center gap-1"
              >
                <Stethoscope className="w-4 h-4" />
                Tedavi Bilgileri
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={createPriceTableElement}
                className="flex items-center gap-1"
              >
                <Table className="w-4 h-4" />
                Fiyat Tablosu
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 relative overflow-auto">
          <div
            ref={canvasRef}
            className="relative bg-white shadow-lg mx-auto my-4"
            style={{
              width: currentPage.width,
              height: currentPage.height,
              transform: 'scale(0.8)',
              transformOrigin: 'top left'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {currentPage.elements.map((element) => (
              <div
                key={element.id}
                data-element-id={element.id}
                className={`absolute cursor-move ${
                  selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  fontSize: element.fontSize,
                  fontFamily: element.fontFamily,
                  color: element.color,
                  opacity: element.opacity,
                  transform: `rotate(${element.rotation}deg)`,
                  zIndex: element.zIndex,
                  display: element.isVisible ? 'block' : 'none',
                  textAlign: element.alignment,
                  backgroundColor: element.backgroundColor || 'transparent',
                  padding: '8px',
                  border: selectedElement?.id === element.id ? '2px solid #3b82f6' : '1px solid #e5e7eb'
                }}
                onMouseDown={handleMouseDown}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElement(element);
                }}
              >
                {element.type === 'text' && (
                  <div dangerouslySetInnerHTML={{ __html: element.content }} />
                )}
                
                {element.type === 'image' && (
                  <img
                    src={element.content}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                )}
                
                {element.type === 'logo' && (
                  element.content ? (
                    <img src={element.content} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-500">Logo</span>
                    </div>
                  )
                )}
                
                {element.type === 'patient-info' && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">Hasta Bilgileri</h3>
                    {element.patientFieldsVisibility?.name && (
                      <div><strong>Ad:</strong> {element.patientData?.name}</div>
                    )}
                    {element.patientFieldsVisibility?.age && (
                      <div><strong>Yaş:</strong> {element.patientData?.age}</div>
                    )}
                    {element.patientFieldsVisibility?.phone && (
                      <div><strong>Telefon:</strong> {element.patientData?.phone}</div>
                    )}
                    {element.patientFieldsVisibility?.email && (
                      <div><strong>E-posta:</strong> {element.patientData?.email}</div>
                    )}
                    {element.patientFieldsVisibility?.address && (
                      <div><strong>Adres:</strong> {element.patientData?.address}</div>
                    )}
                    {element.patientFieldsVisibility?.diagnosis && (
                      <div><strong>Tanı:</strong> {element.patientData?.diagnosis}</div>
                    )}
                    {element.patientFieldsVisibility?.notes && (
                      <div><strong>Notlar:</strong> {element.patientData?.notes}</div>
                    )}
                  </div>
                )}
                
                {element.type === 'treatment-info' && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">Tedavi Bilgileri</h3>
                    {element.treatmentFieldsVisibility?.treatments && (
                      <div><strong>Tedaviler:</strong> {element.treatmentData?.treatments?.join(', ')}</div>
                    )}
                    {element.treatmentFieldsVisibility?.recommendations && (
                      <div><strong>Öneriler:</strong> {element.treatmentData?.recommendations}</div>
                    )}
                    {element.treatmentFieldsVisibility?.nextAppointment && (
                      <div><strong>Sonraki Randevu:</strong> {element.treatmentData?.nextAppointment}</div>
                    )}
                    {element.treatmentFieldsVisibility?.doctor && (
                      <div><strong>Doktor:</strong> {element.treatmentData?.doctor}</div>
                    )}
                  </div>
                )}
                
                {element.type === 'price-table' && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">Fiyat Tablosu</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left">Tedavi</th>
                          <th className="text-left">Açıklama</th>
                          <th className="text-right">Fiyat</th>
                          <th className="text-right">Adet</th>
                          <th className="text-right">Toplam</th>
                        </tr>
                      </thead>
                      <tbody>
                        {element.priceTableData?.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td>{item.treatment}</td>
                            <td>{item.description}</td>
                            <td className="text-right">{item.price} {element.currency}</td>
                            <td className="text-right">{item.quantity}</td>
                            <td className="text-right">{item.total} {element.currency}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {element.showVAT && (
                      <div className="text-right">
                        <strong>KDV (%{element.vatRate}):</strong> 900 {element.currency}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Properties Panel */}
        {showProperties && selectedElement && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Özellikler</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProperties(!showProperties)}
                >
                  Gizle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteElement(selectedElement.id)}
                  className="text-red-600 border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Sil
                </Button>
              </div>
            </div>

            {/* Genel Özellikler */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 mr-2">HTML ile düzenle</label>
                  <input 
                    type="checkbox" 
                    checked={isHtmlEditMode} 
                    onChange={() => toggleHtmlEditMode(selectedElement.id)} 
                  />
                </div>
                {isHtmlEditMode ? (
                  <Textarea
                    value={selectedElement.content}
                    onChange={(e) => updateElementContent(selectedElement.id, e.target.value, true)}
                    rows={6}
                    placeholder="HTML içeriği girin..."
                  />
                ) : (
                  <Textarea
                    value={selectedElement.content.replace(/<[^>]+>/g, '')}
                    onChange={(e) => updateElementContent(selectedElement.id, e.target.value, false)}
                    rows={3}
                    placeholder="Metin içeriği girin..."
                  />
                )}
              </div>

              {/* Pozisyon */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">X</label>
                  <Input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => updateElementProperty(selectedElement.id, 'x', Number(e.target.value))}
                    placeholder="X"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Y</label>
                  <Input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => updateElementProperty(selectedElement.id, 'y', Number(e.target.value))}
                    placeholder="Y"
                  />
                </div>
              </div>

              {/* Boyut */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genişlik</label>
                  <Input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) => updateElementProperty(selectedElement.id, 'width', Number(e.target.value))}
                    placeholder="Genişlik"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yükseklik</label>
                  <Input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) => updateElementProperty(selectedElement.id, 'height', Number(e.target.value))}
                    placeholder="Yükseklik"
                  />
                </div>
              </div>

              {/* Arka Plan Rengi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arka Plan Rengi</label>
                <Input
                  type="color"
                  value={selectedElement.backgroundColor || '#ffffff'}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'backgroundColor', e.target.value)}
                />
              </div>

              {/* Font Özellikleri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Boyutu</label>
                <Input
                  type="number"
                  value={selectedElement.fontSize || 16}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'fontSize', Number(e.target.value))}
                  min="8"
                  max="72"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Ailesi</label>
                <Select
                  value={selectedElement.fontFamily || 'Arial'}
                  onValueChange={(value) => updateElementProperty(selectedElement.id, 'fontFamily', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Renk</label>
                <Input
                  type="color"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'color', e.target.value)}
                />
              </div>

              {/* Hizalama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hizalama</label>
                <div className="flex gap-1">
                  <Button
                    variant={selectedElement.alignment === 'left' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => updateElementProperty(selectedElement.id, 'alignment', 'left')}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={selectedElement.alignment === 'center' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => updateElementProperty(selectedElement.id, 'alignment', 'center')}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={selectedElement.alignment === 'right' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => updateElementProperty(selectedElement.id, 'alignment', 'right')}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Görünürlük ve Efektler */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şeffaflık</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedElement.opacity || 1}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'opacity', Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{selectedElement.opacity || 1}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Döndürme</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedElement.rotation || 0}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'rotation', Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{selectedElement.rotation || 0}°</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Katman Sırası</label>
                <Input
                  type="number"
                  value={selectedElement.zIndex || 1}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'zIndex', Number(e.target.value))}
                  min="1"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedElement.isVisible !== false}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'isVisible', e.target.checked)}
                />
                <label className="text-sm text-gray-700 ml-2">Görünür</label>
              </div>

              {/* Element tipine özel özellikler */}
              {selectedElement.type === 'patient-info' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Hasta Bilgileri Görünürlüğü</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedElement.patientFieldsVisibility || {}).map(([field, visible]) => (
                      <div key={field} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visible}
                          onChange={(e) => updateElementProperty(selectedElement.id, `patientFieldsVisibility.${field}`, e.target.checked)}
                        />
                        <label className="text-sm text-gray-700 ml-2 capitalize">{field}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedElement.type === 'treatment-info' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Tedavi Bilgileri Görünürlüğü</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedElement.treatmentFieldsVisibility || {}).map(([field, visible]) => (
                      <div key={field} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visible}
                          onChange={(e) => updateElementProperty(selectedElement.id, `treatmentFieldsVisibility.${field}`, e.target.checked)}
                        />
                        <label className="text-sm text-gray-700 ml-2 capitalize">{field}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedElement.type === 'price-table' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Fiyat Tablosu Ayarları</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
                      <Select
                        value={selectedElement.currency || 'TRY'}
                        onValueChange={(value) => updateElementProperty(selectedElement.id, 'currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRY">TRY</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">KDV Oranı (%)</label>
                      <Input
                        type="number"
                        value={selectedElement.vatRate || 20}
                        onChange={(e) => updateElementProperty(selectedElement.id, 'vatRate', Number(e.target.value))}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedElement.showVAT !== false}
                        onChange={(e) => updateElementProperty(selectedElement.id, 'showVAT', e.target.checked)}
                      />
                      <label className="text-sm text-gray-700 ml-2">KDV Göster</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <PropertiesPanelOpener />
    </div>
  );
}; 