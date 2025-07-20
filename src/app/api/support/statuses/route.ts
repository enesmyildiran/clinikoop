import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

// GET - Status'ları listele
export async function GET() {
  try {
    // Geliştirme modunda session kontrolünü geçici olarak kaldır
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      const session = await getServerSession(authOptions);
      
      if (!session?.user) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
      }
    }

    const statuses = await prisma.supportStatus.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      statuses 
    });
  } catch (error) {
    console.error('Status\'lar listelenirken hata:', error);
    return NextResponse.json(
      { error: 'Status\'lar listelenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Yeni status oluştur
export async function POST(request: NextRequest) {
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
    const { name, color, order, description, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Status adı gereklidir' },
        { status: 400 }
      );
    }

    const status = await prisma.supportStatus.create({
      data: {
        name,
        displayName: name,
        color: color || '#6B7280',
        order: order || 0,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ 
      success: true, 
      status 
    });
  } catch (error) {
    console.error('Status oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Status oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
} 