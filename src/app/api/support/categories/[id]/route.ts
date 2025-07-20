import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

// PUT - Kategori güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Geliştirme modunda session kontrolünü geçici olarak kaldır
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      const session = await getServerSession(authOptions);
      
      if (!session?.user) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
      }
    }

    const body = await request.json();
    const { name, color, description, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Kategori adı gereklidir' },
        { status: 400 }
      );
    }

    const category = await prisma.supportCategory.update({
      where: { id: params.id },
      data: {
        name,
        displayName: name,
        description,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ 
      success: true, 
      category 
    });
  } catch (error) {
    console.error('Kategori güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Kategori güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE - Kategori sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Geliştirme modunda session kontrolünü geçici olarak kaldır
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      const session = await getServerSession(authOptions);
      
      if (!session?.user) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
      }
    }

    // Önce bu kategoriye ait ticket var mı kontrol et
    const ticketsCount = await prisma.supportTicket.count({
      where: { categoryId: params.id }
    });

    if (ticketsCount > 0) {
      return NextResponse.json(
        { error: 'Bu kategoriye ait destek talepleri bulunduğu için silinemez' },
        { status: 400 }
      );
    }

    await prisma.supportCategory.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Kategori başarıyla silindi' 
    });
  } catch (error) {
    console.error('Kategori silinirken hata:', error);
    return NextResponse.json(
      { error: 'Kategori silinirken hata oluştu' },
      { status: 500 }
    );
  }
} 