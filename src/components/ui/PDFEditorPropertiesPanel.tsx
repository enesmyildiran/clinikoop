import React from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { Trash2, Eye, EyeOff } from 'lucide-react';

interface PDFEditorPropertiesPanelProps {
  selectedElement: any;
  updateElementProperty: (elementId: string, property: string, value: any) => void;
  updateElementContent: (elementId: string, content: string, isHtml?: boolean) => void;
  toggleHtmlEditMode: () => void;
  isHtmlEditMode: boolean;
  onDeleteElement: (elementId: string) => void;
}

const PDFEditorPropertiesPanel: React.FC<PDFEditorPropertiesPanelProps> = ({
  selectedElement,
  updateElementProperty,
  updateElementContent,
  toggleHtmlEditMode,
  isHtmlEditMode,
  onDeleteElement
}) => {
  if (!selectedElement) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">
          <p>Bir element seçin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {selectedElement.type === 'text' && 'Metin Özellikleri'}
          {selectedElement.type === 'image' && 'Resim Özellikleri'}
          {selectedElement.type === 'logo' && 'Logo Özellikleri'}
          {selectedElement.type === 'patient-info' && 'Hasta Bilgileri'}
          {selectedElement.type === 'treatment-info' && 'Tedavi Bilgileri'}
          {selectedElement.type === 'price-table' && 'Fiyat Tablosu'}
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDeleteElement(selectedElement.id)} 
          className="text-red-600 border-red-300"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Genel Özellikler */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Genel Özellikler</h4>
        
        {/* Pozisyon */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">X</label>
            <Input
              type="number"
              value={selectedElement.x}
              onChange={(e) => updateElementProperty(selectedElement.id, 'x', parseInt(e.target.value))}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Y</label>
            <Input
              type="number"
              value={selectedElement.y}
              onChange={(e) => updateElementProperty(selectedElement.id, 'y', parseInt(e.target.value))}
              className="text-sm"
            />
          </div>
        </div>

        {/* Boyut */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Genişlik</label>
            <Input
              type="number"
              value={selectedElement.width}
              onChange={(e) => updateElementProperty(selectedElement.id, 'width', parseInt(e.target.value))}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Yükseklik</label>
            <Input
              type="number"
              value={selectedElement.height}
              onChange={(e) => updateElementProperty(selectedElement.id, 'height', parseInt(e.target.value))}
              className="text-sm"
            />
          </div>
        </div>

        {/* Opaklık */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Opaklık</label>
          <Input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selectedElement.opacity || 1}
            onChange={(e) => updateElementProperty(selectedElement.id, 'opacity', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Döndürme */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Döndürme (°)</label>
          <Input
            type="number"
            value={selectedElement.rotation || 0}
            onChange={(e) => updateElementProperty(selectedElement.id, 'rotation', parseInt(e.target.value))}
            className="text-sm"
          />
        </div>
      </div>

      {/* Metin Özellikleri */}
      {selectedElement.type === 'text' && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Metin Özellikleri</h4>
          
          {/* İçerik */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">İçerik</label>
            <Textarea
              value={selectedElement.content}
              onChange={(e) => updateElementContent(selectedElement.id, e.target.value)}
              className="text-sm"
              rows={3}
            />
          </div>

          {/* Font Boyutu */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Font Boyutu</label>
            <Input
              type="number"
              value={selectedElement.fontSize || 16}
              onChange={(e) => updateElementProperty(selectedElement.id, 'fontSize', parseInt(e.target.value))}
              className="text-sm"
            />
          </div>

          {/* Font Ailesi */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Font</label>
            <Select
              value={selectedElement.fontFamily || 'Arial'}
              onValueChange={(value) => updateElementProperty(selectedElement.id, 'fontFamily', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Renk */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Renk</label>
            <Input
              type="color"
              value={selectedElement.color || '#000000'}
              onChange={(e) => updateElementProperty(selectedElement.id, 'color', e.target.value)}
              className="w-full h-8"
            />
          </div>

          {/* Hizalama */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Hizalama</label>
            <Select
              value={selectedElement.alignment || 'left'}
              onValueChange={(value) => updateElementProperty(selectedElement.id, 'alignment', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Sola</SelectItem>
                <SelectItem value="center">Ortaya</SelectItem>
                <SelectItem value="right">Sağa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Klinik Elementler için Başlık Özellikleri */}
      {(selectedElement.type === 'patient-info' || selectedElement.type === 'treatment-info' || selectedElement.type === 'price-table') && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Başlık Özellikleri</h4>
          
          {/* Başlık Metni */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Başlık Metni</label>
            <Input
              value={selectedElement.titleText || ''}
              onChange={(e) => updateElementProperty(selectedElement.id, 'titleText', e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Başlık Font Boyutu */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Başlık Font Boyutu</label>
            <Input
              type="number"
              value={selectedElement.titleFontSize || 16}
              onChange={(e) => updateElementProperty(selectedElement.id, 'titleFontSize', parseInt(e.target.value))}
              className="text-sm"
            />
          </div>

          {/* Başlık Rengi */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Başlık Rengi</label>
            <Input
              type="color"
              value={selectedElement.titleColor || '#1f2937'}
              onChange={(e) => updateElementProperty(selectedElement.id, 'titleColor', e.target.value)}
              className="w-full h-8"
            />
          </div>

          {/* Başlık Hizalama */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Başlık Hizalama</label>
            <Select
              value={selectedElement.titleAlignment || 'left'}
              onValueChange={(value) => updateElementProperty(selectedElement.id, 'titleAlignment', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Sola</SelectItem>
                <SelectItem value="center">Ortaya</SelectItem>
                <SelectItem value="right">Sağa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Klinik Elementler için İçerik Özellikleri */}
      {(selectedElement.type === 'patient-info' || selectedElement.type === 'treatment-info' || selectedElement.type === 'price-table') && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">İçerik Özellikleri</h4>
          
          {/* İçerik Font Boyutu */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">İçerik Font Boyutu</label>
            <Input
              type="number"
              value={selectedElement.contentFontSize || 12}
              onChange={(e) => updateElementProperty(selectedElement.id, 'contentFontSize', parseInt(e.target.value))}
              className="text-sm"
            />
          </div>

          {/* İçerik Rengi */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">İçerik Rengi</label>
            <Input
              type="color"
              value={selectedElement.contentColor || '#374151'}
              onChange={(e) => updateElementProperty(selectedElement.id, 'contentColor', e.target.value)}
              className="w-full h-8"
            />
          </div>

          {/* Etiket Font Boyutu */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Etiket Font Boyutu</label>
            <Input
              type="number"
              value={selectedElement.labelFontSize || 11}
              onChange={(e) => updateElementProperty(selectedElement.id, 'labelFontSize', parseInt(e.target.value))}
              className="text-sm"
            />
          </div>

          {/* Etiket Rengi */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Etiket Rengi</label>
            <Input
              type="color"
              value={selectedElement.labelColor || '#6b7280'}
              onChange={(e) => updateElementProperty(selectedElement.id, 'labelColor', e.target.value)}
              className="w-full h-8"
            />
          </div>
        </div>
      )}

      {/* Fiyat Tablosu Özel Özellikleri */}
      {selectedElement.type === 'price-table' && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Tablo Özellikleri</h4>
          
          {/* KDV Göster */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">KDV Göster</label>
            <input
              type="checkbox"
              checked={selectedElement.showVAT || false}
              onChange={(e) => updateElementProperty(selectedElement.id, 'showVAT', e.target.checked)}
              className="rounded"
            />
          </div>

          {/* KDV Oranı */}
          {selectedElement.showVAT && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">KDV Oranı (%)</label>
              <Input
                type="number"
                value={selectedElement.vatRate || 18}
                onChange={(e) => updateElementProperty(selectedElement.id, 'vatRate', parseInt(e.target.value))}
                className="text-sm"
              />
            </div>
          )}

          {/* Tablo Başlık Rengi */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Tablo Başlık Rengi</label>
            <Input
              type="color"
              value={selectedElement.tableHeaderColor || '#f3f4f6'}
              onChange={(e) => updateElementProperty(selectedElement.id, 'tableHeaderColor', e.target.value)}
              className="w-full h-8"
            />
          </div>

          {/* Tablo Kenarlık Rengi */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Tablo Kenarlık Rengi</label>
            <Input
              type="color"
              value={selectedElement.tableBorderColor || '#d1d5db'}
              onChange={(e) => updateElementProperty(selectedElement.id, 'tableBorderColor', e.target.value)}
              className="w-full h-8"
            />
          </div>
        </div>
      )}

      {/* Arka Plan Rengi */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">Arka Plan Rengi</label>
        <Input
          type="color"
          value={selectedElement.backgroundColor || '#ffffff'}
          onChange={(e) => updateElementProperty(selectedElement.id, 'backgroundColor', e.target.value)}
          className="w-full h-8"
        />
      </div>

      {/* Z-Index */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">Katman Sırası</label>
        <Input
          type="number"
          value={selectedElement.zIndex || 1}
          onChange={(e) => updateElementProperty(selectedElement.id, 'zIndex', parseInt(e.target.value))}
          className="text-sm"
        />
      </div>

      {/* Hasta Bilgileri Alan Görünürlük Kontrolleri */}
      {selectedElement.type === 'patient-info' && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Alan Görünürlüğü</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Ad</label>
              <input
                type="checkbox"
                checked={selectedElement.patientFieldsVisibility?.name || false}
                onChange={(e) => {
                  const updatedVisibility = {
                    ...selectedElement.patientFieldsVisibility,
                    name: e.target.checked
                  };
                  updateElementProperty(selectedElement.id, 'patientFieldsVisibility', updatedVisibility);
                }}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Telefon</label>
              <input
                type="checkbox"
                checked={selectedElement.patientFieldsVisibility?.phone || false}
                onChange={(e) => {
                  const updatedVisibility = {
                    ...selectedElement.patientFieldsVisibility,
                    phone: e.target.checked
                  };
                  updateElementProperty(selectedElement.id, 'patientFieldsVisibility', updatedVisibility);
                }}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">E-posta</label>
              <input
                type="checkbox"
                checked={selectedElement.patientFieldsVisibility?.email || false}
                onChange={(e) => {
                  const updatedVisibility = {
                    ...selectedElement.patientFieldsVisibility,
                    email: e.target.checked
                  };
                  updateElementProperty(selectedElement.id, 'patientFieldsVisibility', updatedVisibility);
                }}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Sosyal Medya</label>
              <input
                type="checkbox"
                checked={selectedElement.patientFieldsVisibility?.socialMedia || false}
                onChange={(e) => {
                  const updatedVisibility = {
                    ...selectedElement.patientFieldsVisibility,
                    socialMedia: e.target.checked
                  };
                  updateElementProperty(selectedElement.id, 'patientFieldsVisibility', updatedVisibility);
                }}
                className="rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tedavi Bilgileri Alan Görünürlük Kontrolleri */}
      {selectedElement.type === 'treatment-info' && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Alan Görünürlüğü</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Doktor</label>
              <input
                type="checkbox"
                checked={selectedElement.treatmentFieldsVisibility?.doctor || false}
                onChange={(e) => {
                  const updatedVisibility = {
                    ...selectedElement.treatmentFieldsVisibility,
                    doctor: e.target.checked
                  };
                  updateElementProperty(selectedElement.id, 'treatmentFieldsVisibility', updatedVisibility);
                }}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Tedaviler</label>
              <input
                type="checkbox"
                checked={selectedElement.treatmentFieldsVisibility?.treatments || false}
                onChange={(e) => {
                  const updatedVisibility = {
                    ...selectedElement.treatmentFieldsVisibility,
                    treatments: e.target.checked
                  };
                  updateElementProperty(selectedElement.id, 'treatmentFieldsVisibility', updatedVisibility);
                }}
                className="rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFEditorPropertiesPanel; 