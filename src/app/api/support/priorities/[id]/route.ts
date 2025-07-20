import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

// PUT - Öncelik güncelle
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
    const { name, color, level, description, isActive } = body;

    if (!name || !level) {
      return NextResponse.json(
        { error: 'Öncelik adı ve seviye gereklidir' },
        { status: 400 }
      );
    }

    const priority = await prisma.supportPriority.update({
      where: { id: params.id },
      data: {
        name,
        displayName: name,
        color: color || '#6B7280',
        level,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ 
      success: true, 
      priority 
    });
  } catch (error) {
    console.error('Öncelik güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Öncelik güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE - Öncelik sil
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

    // Önce bu önceliğe ait ticket var mı kontrol et
    const ticketsCount = await prisma.supportTicket.count({
      where: { priorityId: params.id }
    });

    if (ticketsCount > 0) {
      return NextResponse.json(
        { error: 'Bu önceliğe ait destek talepleri bulunduğu için silinemez' },
        { status: 400 }
      );
    }

    await prisma.supportPriority.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Öncelik başarıyla silindi' 
    });
  } catch (error) {
    console.error('Öncelik silinirken hata:', error);
    return NextResponse.json(
      { error: 'Öncelik silinirken hata oluştu' },
      { status: 500 }
    );
  }
} 