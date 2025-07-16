"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { PDFGenerator } from '@/lib/pdf-generator'

export default function PDFTestPage() {
  const { addToast } = useToast()
  const [name, setName] = useState('Test Şablon')
  const [description, setDescription] = useState('Test açıklama')
  const [isLoading, setIsLoading] = useState(false)
  const [isPdfLoading, setIsPdfLoading] = useState(false)

  const handleTestSave = async () => {
    setIsLoading(true)
    
    try {
      const testData = {
        name: name,
        description: description,
        content: JSON.stringify({
          pages: [{
            id: '1',
            width: 794,
            height: 1123,
            elements: [{
              id: 'text-1',
              type: 'text',
              content: 'Test Metin',
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
            }]
          }]
        }),
        isDefault: false
      }

      console.log('Test verisi gönderiliyor:', testData)

      const response = await fetch('/api/pdf-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })

      console.log('Response status:', response.status)
      
      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok && data.success) {
        addToast({
          message: 'Test şablonu başarıyla kaydedildi!',
          type: 'success'
        })
      } else {
        addToast({
          message: data.error || 'Test şablonu kaydedilemedi',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Test hatası:', error)
      addToast({
        message: 'Test sırasında hata oluştu',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestPdfDownload = async () => {
    setIsPdfLoading(true)
    
    try {
      console.log('=== PDF İNDİRME TESTİ BAŞLATILIYOR ===')
      
      // Test verisi oluştur
      const testOfferData = {
        patient: {
          firstName: 'Test',
          lastName: 'Hasta',
          phone: '+90 555 123 4567',
          email: 'test@example.com'
        },
        treatments: [
          {
            name: 'Test Tedavi',
            teeth: [1, 2, 3],
            price: 1000,
            currency: 'TRY',
            notes: 'Test notu'
          }
        ],
        totalAmount: 1000,
        currency: 'TRY',
        vatRate: 18,
        vatAmount: 180,
        grandTotal: 1180,
        notes: 'Test teklif notu',
        offerDate: new Date().toLocaleDateString('tr-TR'),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')
      }
      
      console.log('Test teklif verisi:', testOfferData)
      
      // Basit şablon oluştur
      const testTemplate = {
        headerText: 'Test Klinik',
        footerText: 'Test footer',
        colorScheme: 'blue',
        fontSize: 'medium',
        showVAT: true,
        showLogo: false,
        showHeader: true,
        showFooter: true,
        pages: [{
          id: '1',
          width: 794,
          height: 1123,
          elements: [
            {
              id: 'title',
              type: 'text',
              content: 'TEST PDF TEKLİFİ',
              x: 50,
              y: 50,
              width: 400,
              height: 30,
              fontSize: 20,
              fontFamily: 'Arial',
              color: '#000000',
              alignment: 'center',
              isVisible: true
            },
            {
              id: 'patient-name',
              type: 'text',
              content: 'Hasta: {{patient.firstName}} {{patient.lastName}}',
              x: 50,
              y: 100,
              width: 300,
              height: 20,
              fontSize: 14,
              fontFamily: 'Arial',
              color: '#000000',
              alignment: 'left',
              isVisible: true
            },
            {
              id: 'total',
              type: 'text',
              content: 'Toplam: {{grandTotal}} {{currency}}',
              x: 50,
              y: 150,
              width: 300,
              height: 20,
              fontSize: 14,
              fontFamily: 'Arial',
              color: '#000000',
              alignment: 'left',
              isVisible: true
            }
          ]
        }]
      }
      
      console.log('Test şablon:', testTemplate)
      
      // PDF oluştur
      const pdfGenerator = new PDFGenerator(testTemplate)
      console.log('PDFGenerator oluşturuldu')
      
      const pdfBlob = await pdfGenerator.generatePDF(testOfferData)
      console.log('PDF blob oluşturuldu:', pdfBlob)
      console.log('Blob boyutu:', pdfBlob.size)
      console.log('Blob tipi:', pdfBlob.type)
      
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('PDF oluşturulamadı - boş blob')
      }
      
      // PDF'i indir
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'test_teklif.pdf'
      
      console.log('Download link oluşturuldu:', link.href)
      
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        console.log('Temizlik tamamlandı')
      }, 100)
      
      console.log('PDF başarıyla indirildi')
      addToast({
        message: 'Test PDF başarıyla indirildi!',
        type: 'success'
      })
      
    } catch (error) {
      console.error('=== PDF İNDİRME TEST HATASI ===')
      console.error('Hata detayı:', error)
      console.error('Hata mesajı:', (error as any).message)
      console.error('Hata stack:', (error as any).stack)
      
      addToast({
        message: `PDF indirme hatası: ${(error as any).message}`,
        type: 'error'
      })
    } finally {
      setIsPdfLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">PDF Şablon Test Sayfası</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Şablon Adı</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Test şablon adı"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Açıklama</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Test açıklama"
            />
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={handleTestSave}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Test Ediliyor...' : 'Test Şablonu Kaydet'}
            </Button>
            
            <Button
              onClick={handleTestPdfDownload}
              disabled={isPdfLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isPdfLoading ? 'PDF Oluşturuluyor...' : 'Test PDF İndir'}
            </Button>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Test Açıklaması:</h3>
          <p className="text-sm text-gray-600">
            Bu sayfa, PDF şablonu kaydetme ve PDF indirme işlemlerini test etmek için oluşturulmuştur. 
            Basit bir şablon ile API&apos;nin ve PDF oluşturma işleminin çalışıp çalışmadığını kontrol eder.
          </p>
        </div>
      </div>
    </div>
  )
} 