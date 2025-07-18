import React from 'react';
import { Button } from './Button';
import { Plus, Layers, Trash2, Type, Image, Upload, User, Stethoscope, Table, FileText, Settings } from 'lucide-react';

interface PDFEditorToolbarProps {
  currentPageIndex: number;
  pageCount: number;
  onPageChange: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: () => void;
  onDeletePage: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onAddLogo: () => void;
  onAddPatientInfo: () => void;
  onAddTreatmentInfo: () => void;
  onAddPriceTable: () => void;
  onToggleToolbar: () => void;
}

const PDFEditorToolbar: React.FC<PDFEditorToolbarProps> = ({
  currentPageIndex,
  pageCount,
  onPageChange,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onAddText,
  onAddImage,
  onAddLogo,
  onAddPatientInfo,
  onAddTreatmentInfo,
  onAddPriceTable,
  onToggleToolbar
}) => (
  <div className="flex flex-col gap-6 p-4">
    
    {/* Sayfa Yönetimi */}
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 text-sm">Sayfa Yönetimi</h4>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Sayfa:</span>
          <select
            value={currentPageIndex}
            onChange={e => onPageChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-xs w-full"
          >
            {Array.from({ length: pageCount }).map((_, i) => (
              <option key={i} value={i}>Sayfa {i + 1}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAddPage}
            className="text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Ekle
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDuplicatePage}
            className="text-xs"
          >
            <Layers className="w-3 h-3 mr-1" />
            Kopyala
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDeletePage} 
          className="text-red-600 border-red-300 text-xs w-full"
          disabled={pageCount <= 1}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Sil
        </Button>
      </div>
    </div>

    {/* Temel Elementler */}
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 text-sm">Temel Elementler</h4>
      
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddText}
          className="w-full justify-start text-xs"
        >
          <Type className="w-3 h-3 mr-2" />
          Metin Ekle
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddImage}
          className="w-full justify-start text-xs"
        >
          <Image className="w-3 h-3 mr-2" />
          Resim Ekle
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddLogo}
          className="w-full justify-start text-xs"
        >
          <Upload className="w-3 h-3 mr-2" />
          Logo Ekle
        </Button>
      </div>
    </div>

    {/* Klinik Elementler */}
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 text-sm">Klinik Elementler</h4>
      
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddPatientInfo}
          className="w-full justify-start text-xs"
        >
          <User className="w-3 h-3 mr-2" />
          Hasta Bilgileri
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddTreatmentInfo}
          className="w-full justify-start text-xs"
        >
          <Stethoscope className="w-3 h-3 mr-2" />
          Tedavi Bilgileri
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddPriceTable}
          className="w-full justify-start text-xs"
        >
          <Table className="w-3 h-3 mr-2" />
          Fiyat Tablosu
        </Button>
      </div>
    </div>

    {/* Yardımcı Araçlar */}
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 text-sm">Yardımcı Araçlar</h4>
      
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleToolbar}
          className="w-full justify-start text-xs"
        >
          <Settings className="w-3 h-3 mr-2" />
          Ayarlar
        </Button>
      </div>
    </div>

  </div>
);

export default PDFEditorToolbar; 