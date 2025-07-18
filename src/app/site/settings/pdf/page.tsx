"use client"

import { useState, useEffect } from 'react'
import { FaSave, FaFilePdf, FaUndo, FaArrowLeft, FaFont, FaPalette, FaImage, FaList, FaPlus, FaEdit, FaTrash, FaStar, FaCog, FaEye } from 'react-icons/fa'
import { useToast } from '@/components/ui/Toast'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Switch } from '@/components/ui/Switch'
import { Card, CardContent } from '@/components/ui/Card'

const defaultPdfSettings = {
  clinicName: 'Clinikoop Diş Klinikleri',
  clinicSlogan: 'Güvenilir tedavi, kaliteli hizmet',
  clinicAddress: 'Atatürk Caddesi No:123, Şişli, İstanbul, Türkiye',
  clinicPhone: '+90 212 123 4567',
  clinicEmail: 'info@clinikoop.com',
  clinicWebsite: 'https://www.clinikoop.com',
  clinicTaxNumber: '1234567890',
  clinicInstagram: '@clinikoop',
  clinicFacebook: 'clinikoop',
  clinicWhatsapp: '+90 532 123 4567',
  clinicLogo: 'https://via.placeholder.com/120x60/2563eb/ffffff?text=Clinikoop',
  showLogo: true,
  showVAT: true,
  showSocialMedia: true,
  showTaxNumber: true,
  // Font ayarları
  headerFont: 'Arial',
  bodyFont: 'Arial',
  fontSize: '12',
  // Renk ayarları
  primaryColor: '#2563eb',
  secondaryColor: '#64748b',
  textColor: '#1f2937',
  // Logo ayarları
  logoWidth: '120',
  logoHeight: '60'
}

const fontOptions = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Lucida Console', label: 'Lucida Console' },
  { value: 'Palatino', label: 'Palatino' },
  { value: 'Garamond', label: 'Garamond' },
  { value: 'Bookman', label: 'Bookman' },
  { value: 'Avant Garde', label: 'Avant Garde' }
]

interface PdfTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  isDefault: boolean;
  isFixed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PDFSettingsPage() {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfSettings, setPdfSettings] = useState(defaultPdfSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [templates, setTemplates] = useState<PdfTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'settings' | 'templates'>('settings');

  // Ayarları yükle
  useEffect(() => {
    loadSettings();
    loadTemplates();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        const settings = data.data || [];
        
        // PDF ayarlarını filtrele ve state'e yükle
        const pdfData: any = {};
        settings.forEach((setting: any) => {
          if (setting.key.startsWith('pdf.')) {
            const key = setting.key.replace('pdf.', '');
            if (key === 'showLogo' || key === 'showVAT' || key === 'showSocialMedia' || key === 'showTaxNumber') {
              pdfData[key] = setting.value === 'true';
            } else {
              pdfData[key] = setting.value;
            }
          }
        });

        if (Object.keys(pdfData).length > 0) {
          setPdfSettings(prev => ({ ...prev, ...pdfData }));
        }
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplates = async () => {
    setTemplatesLoading(true);
    try {
      const res = await fetch("/api/pdf-templates");
      const data = await res.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Şablonlar yüklenirken hata:', error);
    } finally {
      setTemplatesLoading(false);
    }
  };

  // Değişiklik kontrolü
  useEffect(() => {
    const hasAnyChanges = Object.keys(pdfSettings).some(key => {
      const currentValue = pdfSettings[key as keyof typeof pdfSettings];
      const defaultValue = defaultPdfSettings[key as keyof typeof defaultPdfSettings];
      return currentValue !== defaultValue;
    });
    setHasChanges(hasAnyChanges);
  }, [pdfSettings]);

  // PDF ayarlarını kaydet
  const savePdfSettings = async () => {
    setIsSaving(true);
    try {
      const settings = [
        { key: 'pdf.clinicName', value: pdfSettings.clinicName },
        { key: 'pdf.clinicSlogan', value: pdfSettings.clinicSlogan },
        { key: 'pdf.clinicAddress', value: pdfSettings.clinicAddress },
        { key: 'pdf.clinicPhone', value: pdfSettings.clinicPhone },
        { key: 'pdf.clinicEmail', value: pdfSettings.clinicEmail },
        { key: 'pdf.clinicWebsite', value: pdfSettings.clinicWebsite },
        { key: 'pdf.clinicTaxNumber', value: pdfSettings.clinicTaxNumber },
        { key: 'pdf.clinicInstagram', value: pdfSettings.clinicInstagram },
        { key: 'pdf.clinicFacebook', value: pdfSettings.clinicFacebook },
        { key: 'pdf.clinicWhatsapp', value: pdfSettings.clinicWhatsapp },
        { key: 'pdf.clinicLogo', value: pdfSettings.clinicLogo },
        { key: 'pdf.showLogo', value: pdfSettings.showLogo.toString() },
        { key: 'pdf.showVAT', value: pdfSettings.showVAT.toString() },
        { key: 'pdf.showSocialMedia', value: pdfSettings.showSocialMedia.toString() },
        { key: 'pdf.showTaxNumber', value: pdfSettings.showTaxNumber.toString() },
        { key: 'pdf.headerFont', value: pdfSettings.headerFont },
        { key: 'pdf.bodyFont', value: pdfSettings.bodyFont },
        { key: 'pdf.fontSize', value: pdfSettings.fontSize },
        { key: 'pdf.primaryColor', value: pdfSettings.primaryColor },
        { key: 'pdf.secondaryColor', value: pdfSettings.secondaryColor },
        { key: 'pdf.textColor', value: pdfSettings.textColor },
        { key: 'pdf.logoWidth', value: pdfSettings.logoWidth },
        { key: 'pdf.logoHeight', value: pdfSettings.logoHeight }
      ];

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });

      if (response.ok) {
        addToast({ message: 'PDF ayarları başarıyla kaydedildi', type: 'success' });
        setHasChanges(false);
      } else {
        addToast({ message: 'PDF ayarları kaydedilemedi', type: 'error' });
      }
    } catch (error) {
      addToast({ message: 'Bir hata oluştu', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Varsayılana sıfırla
  const resetToDefaults = () => {
    setPdfSettings(defaultPdfSettings);
    addToast({ message: 'Ayarlar varsayılana sıfırlandı', type: 'info' });
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setPdfSettings(prev => ({ ...prev, [key]: value }));
  };

  // Şablon işlemleri
  const handleSetDefault = async (id: string) => {
    try {
      await fetch("/api/pdf-templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDefault: true }),
      });
      loadTemplates();
      addToast({
        message: "Varsayılan şablon güncellendi",
        type: "success"
      });
    } catch (error) {
      addToast({
        message: "Bir hata oluştu",
        type: "error"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu şablonu silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/pdf-templates?id=${id}`, { method: "DELETE" });
      loadTemplates();
      addToast({
        message: "Şablon başarıyla silindi",
        type: "success"
      });
    } catch (error) {
      addToast({
        message: "Bir hata oluştu",
        type: "error"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ayarlar yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/site/settings"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm">Ayarlara Dön</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">PDF Ayarları</h1>
            <p className="text-gray-600 text-sm">PDF tekliflerinde kullanılacak klinik bilgileri ve şablon yönetimi</p>
          </div>
        </div>
      </div>

      {/* Tab Menüsü */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaCog className="inline mr-2" />
          PDF Ayarları
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'templates'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaList className="inline mr-2" />
          PDF Şablonları
        </button>
      </div>

      {/* PDF Ayarları Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Klinik Bilgileri */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaImage className="text-blue-600" />
                Klinik Bilgileri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Klinik Adı</label>
                  <Input
                    value={pdfSettings.clinicName}
                    onChange={(e) => handleInputChange('clinicName', e.target.value)}
                    placeholder="Klinik adını girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                  <Input
                    value={pdfSettings.clinicSlogan}
                    onChange={(e) => handleInputChange('clinicSlogan', e.target.value)}
                    placeholder="Klinik sloganı"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                  <Textarea
                    value={pdfSettings.clinicAddress}
                    onChange={(e) => handleInputChange('clinicAddress', e.target.value)}
                    placeholder="Klinik adresi"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <Input
                    value={pdfSettings.clinicPhone}
                    onChange={(e) => handleInputChange('clinicPhone', e.target.value)}
                    placeholder="+90 212 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <Input
                    value={pdfSettings.clinicEmail}
                    onChange={(e) => handleInputChange('clinicEmail', e.target.value)}
                    placeholder="info@clinikoop.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <Input
                    value={pdfSettings.clinicWebsite}
                    onChange={(e) => handleInputChange('clinicWebsite', e.target.value)}
                    placeholder="https://www.clinikoop.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Numarası</label>
                  <Input
                    value={pdfSettings.clinicTaxNumber}
                    onChange={(e) => handleInputChange('clinicTaxNumber', e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sosyal Medya */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaPalette className="text-green-600" />
                Sosyal Medya
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <Input
                    value={pdfSettings.clinicInstagram}
                    onChange={(e) => handleInputChange('clinicInstagram', e.target.value)}
                    placeholder="@clinikoop"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <Input
                    value={pdfSettings.clinicFacebook}
                    onChange={(e) => handleInputChange('clinicFacebook', e.target.value)}
                    placeholder="clinikoop"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <Input
                    value={pdfSettings.clinicWhatsapp}
                    onChange={(e) => handleInputChange('clinicWhatsapp', e.target.value)}
                    placeholder="+90 532 123 4567"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Görünüm Ayarları */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaFont className="text-purple-600" />
                Görünüm Ayarları
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Görünürlük</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-600">Logo Göster</label>
                      <Switch
                        checked={pdfSettings.showLogo}
                        onCheckedChange={(checked) => handleInputChange('showLogo', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-600">KDV Bilgisi</label>
                      <Switch
                        checked={pdfSettings.showVAT}
                        onCheckedChange={(checked) => handleInputChange('showVAT', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-600">Sosyal Medya</label>
                      <Switch
                        checked={pdfSettings.showSocialMedia}
                        onCheckedChange={(checked) => handleInputChange('showSocialMedia', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-600">Vergi Numarası</label>
                      <Switch
                        checked={pdfSettings.showTaxNumber}
                        onCheckedChange={(checked) => handleInputChange('showTaxNumber', checked)}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Font Ayarları</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Başlık Fontu</label>
                      <select
                        value={pdfSettings.headerFont}
                        onChange={(e) => handleInputChange('headerFont', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {fontOptions.map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">İçerik Fontu</label>
                      <select
                        value={pdfSettings.bodyFont}
                        onChange={(e) => handleInputChange('bodyFont', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {fontOptions.map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Font Boyutu</label>
                      <Input
                        type="number"
                        value={pdfSettings.fontSize}
                        onChange={(e) => handleInputChange('fontSize', e.target.value)}
                        min="8"
                        max="24"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aksiyon Butonları */}
          <div className="flex items-center justify-between">
            <Button
              onClick={resetToDefaults}
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              <FaUndo className="mr-2" />
              Varsayılana Sıfırla
            </Button>
            <Button
              onClick={savePdfSettings}
              disabled={isSaving || !hasChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FaSave className="mr-2" />
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </div>
      )}

      {/* PDF Şablonları Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaList className="text-blue-600" />
                  PDF Şablonları
                </h3>
                <Link href="/pdf-templates/new">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <FaPlus className="mr-2" />
                    Yeni Şablon
                  </Button>
                </Link>
              </div>
              {templatesLoading ? (
                <div className="text-gray-500">Şablonlar yükleniyor...</div>
              ) : templates.length === 0 ? (
                <div className="text-gray-500">Kayıtlı şablon yok.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((tpl) => (
                    <div key={tpl.id} className={`border rounded-lg p-4 shadow-sm relative ${tpl.isDefault ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-800 flex items-center gap-2">
                          {tpl.isDefault && <FaStar className="text-yellow-400" title="Varsayılan" />}
                          {tpl.name}
                        </div>
                        <div className="flex gap-2">
                          {!tpl.isDefault && (
                            <Button size="sm" variant="outline" onClick={() => handleSetDefault(tpl.id)}>
                              Varsayılan Yap
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleDelete(tpl.id)}>
                            <FaTrash className="inline" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">Oluşturulma: {new Date(tpl.createdAt).toLocaleDateString('tr-TR')}</div>
                      <div className="mb-2 text-gray-700 text-sm line-clamp-2">{tpl.description}</div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => {
                          // Şablon önizleme modalı açılabilir veya PDFPreview ile gösterilebilir
                          addToast({ message: 'Şablon önizleme özelliği yakında!', type: 'info' });
                        }}
                      >
                        Önizle
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 