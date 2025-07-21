import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

// GET - Öncelikleri listele
export async function GET() {
  try {
    // Session kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    // Kullanıcının clinic ID'sini al
    let clinicId: string | null = null;
    
    // Önce ClinicUser tablosunda ara
    const clinicUser = await prisma.clinicUser.findUnique({
      where: { id: session.user.id },
      select: { clinicId: true }
    });
    
    if (clinicUser?.clinicId) {
      clinicId = clinicUser.clinicId;
    } else {
      // Admin kullanıcısı ise test clinic ID kullan
      const testClinic = await prisma.clinic.findFirst({
        select: { id: true }
      });
      clinicId = testClinic?.id || null;
    }

    if (!clinicId) {
      return NextResponse.json({ error: 'Klinik bilgisi bulunamadı' }, { status: 400 });
    }

    const priorities = await prisma.supportPriority.findMany({
      where: {
        clinicId: clinicId,
        isActive: true
      },
      orderBy: {
        level: 'asc'
      }
    });

    // Eğer hiç öncelik yoksa, default öncelikler oluştur
    if (priorities.length === 0) {
      const defaultPriorities = [
        { name: 'Düşük', displayName: 'Düşük', color: '#10B981', level: 1, clinicId: clinicId },
        { name: 'Normal', displayName: 'Normal', color: '#3B82F6', level: 2, clinicId: clinicId },
        { name: 'Yüksek', displayName: 'Yüksek', color: '#F59E0B', level: 3, clinicId: clinicId },
        { name: 'Kritik', displayName: 'Kritik', color: '#EF4444', level: 4, clinicId: clinicId }
      ];

      await prisma.supportPriority.createMany({
        data: defaultPriorities
      });

      const newPriorities = await prisma.supportPriority.findMany({
        where: { 
          clinicId: clinicId,
          isActive: true 
        },
        orderBy: { level: 'asc' }
      });

      return NextResponse.json({ 
        success: true, 
        priorities: newPriorities 
      });
    }

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
    // Session kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    // Kullanıcının clinic ID'sini al
    let clinicId: string | null = null;
    
    // Önce ClinicUser tablosunda ara
    const clinicUser = await prisma.clinicUser.findUnique({
      where: { id: session.user.id },
      select: { clinicId: true }
    });
    
    if (clinicUser?.clinicId) {
      clinicId = clinicUser.clinicId;
    } else {
      // Admin kullanıcısı ise test clinic ID kullan
      const testClinic = await prisma.clinic.findFirst({
        select: { id: true }
      });
      clinicId = testClinic?.id || null;
    }

    if (!clinicId) {
      return NextResponse.json({ error: 'Klinik bilgisi bulunamadı' }, { status: 400 });
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
        isActive: isActive !== false,
        clinicId: clinicId
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