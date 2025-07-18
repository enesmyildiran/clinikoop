import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Tek PDF şablonu getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.pdfTemplate.findUnique({
      where: { id: params.id }
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
  } catch (error) {
    console.error('PDF şablonu getirilirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'PDF şablonu getirilemedi' },
      { status: 500 }
    );
  }
}

// PUT: PDF şablonunu güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, content, isDefault } = body;

    if (!name || !content) {
      return NextResponse.json(
        { success: false, error: 'Şablon adı ve içeriği zorunludur' },
        { status: 400 }
      );
    }

    // Eğer bu şablon varsayılan olarak işaretleniyorsa, diğerlerini varsayılan olmaktan çıkar
    if (isDefault) {
      await prisma.pdfTemplate.updateMany({
        where: { 
          isDefault: true,
          id: { not: params.id }
        },
        data: { isDefault: false }
      });
    }

    const template = await prisma.pdfTemplate.update({
      where: { id: params.id },
      data: {
        name,
        description: description || '',
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.pdfTemplate.delete({
      where: { id: params.id }
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