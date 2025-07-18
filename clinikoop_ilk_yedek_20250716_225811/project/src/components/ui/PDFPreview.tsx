"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { useToast } from "./Toast";
import { FaDownload, FaEye, FaTimes } from 'react-icons/fa';
import Loading from './Loading';

interface PDFPreviewProps {
  data: any;
  onClose?: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ data, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Data kontrolü - eğer data yoksa veya patient yoksa güvenli varsayılan değerler kullan
  const safeData = {
    clinic: data?.clinic || { name: 'Klinik' },
    patient: data?.patient || { firstName: '', lastName: '', phone: '', email: '' },
    treatments: data?.treatments || [],
    grandTotal: data?.grandTotal || '0',
    currency: data?.currency || '₺'
  };

  const handleDownload = async () => {
    if (!mounted || !data) {
      addToast({ message: "Teklif verisi bulunamadı", type: "error" });
      return;
    }
    setIsLoading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      // Basit HTML oluştur
      const html = `
        <div style="padding:32px; font-family:Arial,sans-serif; color:#222;">
          <h1 style="text-align:center; color:#2563eb;">${safeData.clinic?.name || 'Klinik'} Teklif</h1>
          <h2>Hasta Bilgileri</h2>
          <p><b>Ad Soyad:</b> ${safeData.patient?.firstName || ''} ${safeData.patient?.lastName || ''}</p>
          <p><b>Telefon:</b> ${safeData.patient?.phone || ''}</p>
          <p><b>E-posta:</b> ${safeData.patient?.email || ''}</p>
          <h2>Tedavi ve Fiyat Tablosu</h2>
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="border:1px solid #ddd; padding:8px;">Tedavi</th>
                <th style="border:1px solid #ddd; padding:8px;">Diş(ler)</th>
                <th style="border:1px solid #ddd; padding:8px; text-align:right;">Fiyat</th>
              </tr>
            </thead>
            <tbody>
              ${safeData.treatments?.map((t: any) => `
                <tr>
                  <td style="border:1px solid #ddd; padding:8px;">${t.name || ''}</td>
                  <td style="border:1px solid #ddd; padding:8px;">${t.selectedTeeth || ''}</td>
                  <td style="border:1px solid #ddd; padding:8px; text-align:right;">${t.price || '0'}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
          <h2 style="text-align:right; margin-top:24px;">Toplam: <span style="color:#2563eb;">${safeData.grandTotal || '0'} ${safeData.currency || '₺'}</span></h2>
        </div>
      `;
      // Geçici bir div oluştur
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      document.body.appendChild(tempDiv);
      await html2pdf().from(tempDiv).set({
        margin: 10,
        filename: `teklif-${safeData.patient?.firstName || 'hasta'}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();
      document.body.removeChild(tempDiv);
      addToast({ message: "PDF başarıyla indirildi", type: "success" });
    } catch (error) {
      addToast({ message: "PDF indirilirken hata oluştu", type: "error" });
    }
    setIsLoading(false);
  };

  // Server-side rendering sırasında hiçbir şey render etme
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">PDF Önizleme</h2>
            <div className="flex gap-2">
              <Button onClick={handleDownload} disabled={isLoading} className="flex items-center gap-2">
                <FaDownload className="w-4 h-4" />
                {isLoading ? "İndiriliyor..." : "PDF İndir"}
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
                  <FaTimes className="w-4 h-4" />
                  Kapat
                </Button>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            {isLoading ? (
              <div className="text-center py-8">
                <Loading />
                <p className="mt-2 text-gray-600">PDF hazırlanıyor...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Hasta Bilgileri</h3>
                  <p><strong>Ad Soyad:</strong> {safeData.patient?.firstName || ''} {safeData.patient?.lastName || ''}</p>
                  <p><strong>Telefon:</strong> {safeData.patient?.phone || ''}</p>
                  <p><strong>E-posta:</strong> {safeData.patient?.email || ''}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Tedaviler</h3>
                  <div className="space-y-2">
                    {safeData.treatments?.map((treatment: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                        <span>{treatment.name || 'Tedavi'}</span>
                        <span className="font-semibold">{treatment.price || '0'} {safeData.currency}</span>
                      </div>
                    ))}
                    {(!safeData.treatments || safeData.treatments.length === 0) && (
                      <p className="text-gray-500 text-center py-4">Tedavi bilgisi bulunamadı</p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <h3 className="text-lg font-semibold">
                    Toplam: {safeData.grandTotal || '0'} {safeData.currency}
                  </h3>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 