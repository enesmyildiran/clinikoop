import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getClinicIdFromRequest } from '@/lib/clinic-routing';

// GET: Tüm PDF şablonlarını listele veya tek şablon getir
export async function GET(request: NextRequest) {
  try {
    const clinicId = await getClinicIdFromRequest(request);
    
    if (!clinicId) {
      return NextResponse.json(
        { success: false, error: 'Klinik bilgisi bulunamadı' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Eğer id parametresi varsa, tek şablon getir
    if (id) {
      const template = await prisma.pDFTemplate.findFirst({
        where: { 
          id,
          clinicId: clinicId
        }
      });

      if (!template) {
        return NextResponse.json(
          { success: false, error: 'Şablon bulunamadı' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: template
      });
    }

    // Tüm şablonları listele
    let templates = await prisma.pDFTemplate.findMany({
      where: { clinicId: clinicId },
      orderBy: {
        createdAt: 'desc'
      }
    });
    if (templates.length === 0) {
      // Otomatik varsayılan şablon ekle
      const defaultContent = `<!-- PDF Şablonunuzun HTML'i -->\n<div style=\"padding:32px; font-family:Arial,sans-serif; color:#222;\">\n  <h1 style=\"text-align:center; color:#2563eb;\">{{clinic.name}} Teklif</h1>\n  <h2>Hasta Bilgileri</h2>\n  <p><b>Ad Soyad:</b> {{patient.name}}</p>\n  <p><b>Telefon:</b> {{patient.phone}}</p>\n  <p><b>E-posta:</b> {{patient.email}}</p>\n  <h2>Tedavi ve Fiyat Tablosu</h2>\n  <table style=\"width:100%; border-collapse:collapse;\">\n    <thead>\n      <tr style=\"background:#f3f4f6;\">\n        <th style=\"border:1px solid #ddd; padding:8px;\">Tedavi</th>\n        <th style=\"border:1px solid #ddd; padding:8px;\">Diş(ler)</th>\n        <th style=\"border:1px solid #ddd; padding:8px; text-align:right;\">Fiyat</th>\n      </tr>\n    </thead>\n    <tbody>\n      {{#each treatments}}\n      <tr>\n        <td style=\"border:1px solid #ddd; padding:8px;\">{{name}}</td>\n        <td style=\"border:1px solid #ddd; padding:8px;\">{{teeth}}</td>\n        <td style=\"border:1px solid #ddd; padding:8px; text-align:right;\">{{price}}</td>\n      </tr>\n      {{/each}}\n    </tbody>\n  </table>\n  <h2 style=\"text-align:right; margin-top:24px;\">Toplam: <span style=\"color:#2563eb;\">{{offer.grandTotal}} {{offer.currency}}</span></h2>\n</div>`;
      await prisma.pDFTemplate.create({
        data: {
          name: 'Standart Teklif',
          description: 'Otomatik oluşturulan standart şablon',
          content: defaultContent,
          isDefault: true,
          clinicId: clinicId
        }
      });
      templates = await prisma.pDFTemplate.findMany({
        where: { clinicId: clinicId },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('PDF şablonları listelenirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'PDF şablonları listelenemedi' },
      { status: 500 }
    );
  }
}

// POST: Yeni PDF şablonu oluştur
export async function POST(request: NextRequest) {
  console.log('=== API POST BAŞLADI ===')
  
  try {
    const clinicId = await getClinicIdFromRequest(request);
    
    if (!clinicId) {
      return NextResponse.json(
        { success: false, error: 'Klinik bilgisi bulunamadı' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('=== GELEN VERİ ===')
    console.log('Body:', body)
    console.log('Body keys:', Object.keys(body))
    
    const { name, description, content, isDefault = false } = body;

    console.log('=== AYIKLANAN VERİ ===')
    console.log('Name:', name)
    console.log('Description:', description)
    console.log('Content:', content)
    console.log('Content type:', typeof content)
    console.log('IsDefault:', isDefault)

    if (!name || !content) {
      console.log('=== VALIDASYON HATASI ===')
      console.log('Name exists:', !!name)
      console.log('Content exists:', !!content)
      
      return NextResponse.json(
        { success: false, error: 'Şablon adı ve içeriği zorunludur' },
        { status: 400 }
      );
    }

    console.log('=== VERİTABANI İŞLEMİ BAŞLIYOR ===')

    // Eğer bu şablon varsayılan olarak işaretleniyorsa, diğerlerini varsayılan olmaktan çıkar
    if (isDefault) {
      console.log('Diğer şablonları varsayılan olmaktan çıkarıyor...')
      await prisma.pDFTemplate.updateMany({
        where: { 
          isDefault: true,
          clinicId: clinicId
        },
        data: { isDefault: false }
      });
    }

    console.log('Yeni şablon oluşturuluyor...')
    const template = await prisma.pDFTemplate.create({
      data: {
        name,
        description: description || '',
        content,
        isDefault,
        clinicId: clinicId
      }
    });

    console.log('=== BAŞARILI ===')
    console.log('Oluşturulan template:', template)

    return NextResponse.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('=== API HATASI ===')
    console.error('PDF şablonu oluşturulurken hata:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    
    return NextResponse.json(
      { success: false, error: 'PDF şablonu oluşturulamadı: ' + errorMessage },
      { status: 500 }
    );
  }
}

// PUT: PDF şablonunu güncelle
export async function PUT(request: NextRequest) {
  try {
    const clinicId = await getClinicIdFromRequest(request);
    
    if (!clinicId) {
      return NextResponse.json(
        { success: false, error: 'Klinik bilgisi bulunamadı' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { id, name, content, isDefault } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Şablon ID\'si zorunludur' },
        { status: 400 }
      );
    }

    // Eğer bu şablon varsayılan olarak işaretleniyorsa, diğerlerini varsayılan olmaktan çıkar
    if (isDefault) {
      await prisma.pDFTemplate.updateMany({
        where: { 
          isDefault: true,
          clinicId: clinicId,
          id: { not: id }
        },
        data: { isDefault: false }
      });
    }

    const template = await prisma.pDFTemplate.update({
      where: { 
        id,
        clinicId: clinicId
      },
      data: {
        name,
        content,
        isDefault
      }
    });

    return NextResponse.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('PDF şablonu güncellenirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'PDF şablonu güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE: PDF şablonunu sil
export async function DELETE(request: NextRequest) {
  try {
    const clinicId = await getClinicIdFromRequest(request);
    
    if (!clinicId) {
      return NextResponse.json(
        { success: false, error: 'Klinik bilgisi bulunamadı' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Şablon ID\'si zorunludur' },
        { status: 400 }
      );
    }

    await prisma.pDFTemplate.delete({
      where: { 
        id,
        clinicId: clinicId
      }
    });

    return NextResponse.json({
      success: true,
      message: 'PDF şablonu başarıyla silindi'
    });
  } catch (error) {
    console.error('PDF şablonu silinirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'PDF şablonu silinemedi' },
      { status: 500 }
    );
  }
} 