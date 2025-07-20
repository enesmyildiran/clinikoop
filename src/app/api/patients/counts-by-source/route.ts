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

    // Referral source'a göre hasta sayıları
    const patientCountsBySource = await prisma.patient.groupBy({
      by: ['referralSourceId'],
      where: {
        clinicId: clinicId,
        isActive: true,
      },
      _count: {
        id: true,
      },
    });

    // Referral source bilgilerini al
    const referralSources = await prisma.referralSource.findMany({
      where: {
        clinicId: clinicId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        color: true,
      },
    });

    // Sonuçları birleştir
    const result = referralSources.map(source => {
      const count = patientCountsBySource.find(
        item => item.referralSourceId === source.id
      );
      return {
        sourceId: source.id,
        sourceName: source.displayName,
        sourceColor: source.color,
        patientCount: count?._count.id || 0,
      };
    });

    // Toplam hasta sayısı
    const totalPatients = await prisma.patient.count({
      where: {
        clinicId: clinicId,
        isActive: true,
      },
    });

    // Aktif hasta sayısı (son 30 günde teklif alan)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activePatients = await prisma.patient.count({
      where: {
        clinicId: clinicId,
        isActive: true,
        offers: {
          some: {
            offer: {
              createdAt: {
                gte: thirtyDaysAgo,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        bySource: result,
        total: totalPatients,
        active: activePatients,
        inactive: totalPatients - activePatients,
      },
    });
  } catch (error) {
    console.error('Error getting patient counts:', error);
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 