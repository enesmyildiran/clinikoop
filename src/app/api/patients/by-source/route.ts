import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getClinicIdFromRequest } from '@/lib/clinic-routing';

export async function GET(req: NextRequest) {
  try {
    const clinicId = await getClinicIdFromRequest(req);
    if (!clinicId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Klinik bilgisi bulunamadı.' 
      }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const referralSourceId = searchParams.get('referralSourceId');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // Filtreleme koşullarını hazırla
    const whereClause: any = {
      clinicId: clinicId,
      isActive: true,
    };

    // Referral source filtresi
    if (referralSourceId) {
      whereClause.referralSourceId = referralSourceId;
    }

    // Arama filtresi
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Status filtresi (aktif/pasif)
    if (status === 'inactive') {
      whereClause.isActive = false;
    }

    const patients = await prisma.patient.findMany({
      where: whereClause,
      include: {
        referralSource: {
          select: {
            id: true,
            name: true,
            displayName: true,
            color: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            offers: true,
            reminders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ 
      success: true, 
      patients,
      total: patients.length
    });
  } catch (error) {
    console.error('Error filtering patients:', error);
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 