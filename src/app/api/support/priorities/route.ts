import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

// GET - Öncelikleri listele
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

    const priorities = await prisma.supportPriority.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        level: 'asc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      priorities 
    });
  } catch (error) {
    console.error('Öncelikler listelenirken hata:', error);
    return NextResponse.json(
      { error: 'Öncelikler listelenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Yeni öncelik oluştur
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
    const { name, color, level, description, isActive } = body;

    if (!name || !level) {
      return NextResponse.json(
        { error: 'Öncelik adı ve seviye gereklidir' },
        { status: 400 }
      );
    }

    const priority = await prisma.supportPriority.create({
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
    console.error('Öncelik oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Öncelik oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
} 