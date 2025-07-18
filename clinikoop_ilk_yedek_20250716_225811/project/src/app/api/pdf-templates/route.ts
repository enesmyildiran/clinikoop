import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Tüm PDF şablonlarını listele veya tek şablon getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Eğer id parametresi varsa, tek şablon getir
    if (id) {
      const template = await prisma.pdfTemplate.findUnique({
        where: { id }
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
    const templates = await prisma.pdfTemplate.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

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
      await prisma.pdfTemplate.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });
    }

    console.log('Yeni şablon oluşturuluyor...')
    const template = await prisma.pdfTemplate.create({
      data: {
        name,
        description: description || '',
        content,
        isDefault
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
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return NextResponse.json(
      { success: false, error: 'PDF şablonu oluşturulamadı: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT: PDF şablonunu güncelle
export async function PUT(request: NextRequest) {
  try {
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
      await prisma.pdfTemplate.updateMany({
        where: { 
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      });
    }

    const template = await prisma.pdfTemplate.update({
      where: { id },
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Şablon ID\'si zorunludur' },
        { status: 400 }
      );
    }

    await prisma.pdfTemplate.delete({
      where: { id }
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