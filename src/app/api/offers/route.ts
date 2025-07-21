import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getClinicIdFromRequest } from '@/lib/clinic-routing'
import { offersCreated, databaseQueryDuration } from '@/lib/metrics'

// Teklif verisi için tip tanımı
interface OfferData {
  patientInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    specialNotes: string;
  };
  treatmentDetails: Array<{
    treatmentKey: string;
    treatmentName: string;
    selectedTeeth: number[];
    toothPricing: Array<{
      toothNumber: number;
      price: number;
      currency: string;
      vatRate: number;
      vatAmount: number;
      totalPrice: number;
    }>;
    notes: string;
    estimatedDuration?: string;
    priority?: number;
    estimatedDays?: number;
    estimatedHours?: number;
  }>;
  socials: Record<string, string>;
  status: 'draft' | 'sent';
  createdAt: string;
  slug?: string;
  selectedTemplate?: string;
  verificationMethod?: string;
  verificationValue?: string;
  validUntil?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Klinik ID'yi önce header'dan al
    const headerClinicId = await getClinicIdFromRequest(request);
    // Query parametresinden de al (varsa öncelikli)
    const { searchParams } = new URL(request.url);
    const queryClinicId = searchParams.get('clinic');
    const clinicId = queryClinicId || headerClinicId;

    if (!clinicId) {
      console.error('[offers][GET] Klinik ID bulunamadı! headerClinicId:', headerClinicId, 'queryClinicId:', queryClinicId);
    }

    // Filtreleme koşullarını hazırla
    const whereClause: any = {
      isDeleted: false,
    };

    // Eğer clinicId varsa, sadece o kliniğin tekliflerini getir
    if (clinicId) {
      whereClause.clinicId = clinicId;
    }

    let offers = [];
    try {
      offers = await prisma.offer.findMany({
        where: whereClause,
        include: {
          patientOffers: {
            include: {
              patient: {
                select: {
                  id: true,
                  name: true,
                  isActive: true,
                },
              },
            },
          },
          status: {
            select: {
              id: true,
              name: true,
              displayName: true,
              color: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (prismaError) {
      console.error('[offers][GET] Prisma findMany error:', prismaError.message, prismaError.stack);
      return NextResponse.json(
        { success: false, message: 'Sunucu hatası (prisma)', error: prismaError.message, stack: prismaError.stack },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, offers })
  } catch (error) {
    console.error('[offers][GET] Genel hata:', error.message, error.stack)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası', error: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}

// POST: Yeni teklif oluştur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // KlinikId'yi al
    const clinicId = await getClinicIdFromRequest(req);
    // KlinikId kontrolü ve veritabanında var mı kontrolü
    if (!clinicId) {
      console.warn('[offers][POST] clinicId yok, hasta oluşturulmadı');
      return NextResponse.json({
        success: false,
        error: 'Klinik bilgisi bulunamadı.'
      }, { status: 400 });
    }
    const clinicExists = await prisma.clinic.findUnique({ where: { id: clinicId } });
    if (!clinicExists) {
      console.warn('[offers][POST] Belirtilen clinicId veritabanında bulunamadı:', clinicId);
      return NextResponse.json({
        success: false,
        error: 'Belirtilen clinicId veritabanında bulunamadı.'
      }, { status: 400 });
    }
    
    // Önce hasta oluştur veya mevcut hastayı bul
    let patient = await prisma.patient.findFirst({
      where: {
        phone: body.patient?.phone || body.patientInfo?.phone,
        clinicId: clinicId,
        isDeleted: false,
      },
    });

    if (!patient) {
      const patientData = body.patient || body.patientInfo;
      patient = await prisma.patient.create({
        data: {
          name: patientData.name || `${patientData.firstName} ${patientData.lastName}`,
          email: patientData.email,
          phone: patientData.phone,
          notes: patientData.notes || patientData.specialNotes,
          clinicId: clinicId
        },
      });
    }

    // Varsayılan durumu bul
    const defaultStatus = await prisma.offerStatus.findFirst({
      where: { 
        clinicId: clinicId,
        isDefault: true 
      }
    });

    if (!defaultStatus) {
      return NextResponse.json({ 
        success: false, 
        error: 'Varsayılan durum bulunamadı.' 
      }, { status: 500 });
    }

    // Slug oluştur
    const slug = body.slug || `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Basit fiyat hesaplama
    const treatments = body.treatments || body.treatmentDetails || [];
    let totalPrice = 0;
    let currency = 'TRY';

    if (treatments.length > 0) {
      // Farklı yapıları destekle
      for (const treatment of treatments) {
        if (treatment.price) {
          totalPrice += parseFloat(treatment.price);
          currency = treatment.currency || currency;
        } else if (treatment.toothPricing && treatment.toothPricing.length > 0) {
          for (const pricing of treatment.toothPricing) {
            totalPrice += parseFloat(pricing.totalPrice || pricing.price || 0);
            currency = pricing.currency || currency;
          }
        }
      }
    }

    // Eğer body'de grandTotal varsa onu kullan
    if (body.grandTotal) {
      totalPrice = parseFloat(body.grandTotal);
    }
    if (body.currency) {
      currency = body.currency;
    }

    // Teklif oluştur
    const offer = await prisma.offer.create({
      data: {
        slug: slug,
        title: body.title || `${patient.name} - Tedavi Teklifi`,
        description: treatments.map(t => t.name || t.treatmentName).join(', ') || 'Tedavi Teklifi',
        totalPrice: totalPrice,
        currency: currency,
        statusId: defaultStatus.id,
        clinicId: clinicId,
        validUntil: body.validUntil ? new Date(body.validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // PatientOffer ilişkisini oluştur
    await prisma.patientOffer.create({
      data: {
        patientId: patient.id,
        offerId: offer.id,
        clinicId: clinicId,
        assigned: true,
        visible: true,
      },
    });

    // Tedavileri kaydet
    for (const treatment of treatments) {
              await prisma.treatment.create({
          data: {
            name: treatment.name || treatment.treatmentName,
            description: treatment.description || '',
            price: parseFloat(treatment.price || treatment.toothPricing?.[0]?.totalPrice || 0),
            currency: currency,
            offerId: offer.id,
          },
        });
    }

    // Not oluştur
    if (body.notes || body.patientInfo?.specialNotes) {
      await prisma.note.create({
        data: {
          title: 'Teklif Notu',
          content: body.notes || body.patientInfo.specialNotes,
          patientId: patient.id,
          offerId: offer.id,
          userId: 'system',
          clinicId: clinicId,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      offer: {
        id: offer.id,
        slug: offer.slug,
        title: offer.title,
        totalPrice: offer.totalPrice,
        currency: offer.currency
      }
    });

  } catch (error: any) {
    console.error('[offers][POST] Hata:', error.message);
    console.error('[offers][POST] Stack:', error.stack);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const id = url.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'id gerekli' }, { status: 400 });
  }
  
  // ClinicId'yi al
  const clinicId = await getClinicIdFromRequest(req);
  if (!clinicId) {
    return NextResponse.json({ error: 'Klinik bilgisi bulunamadı' }, { status: 400 });
  }
  
  const offer = await prisma.offer.updateMany({
    where: { 
      id, 
      clinicId: clinicId,
    },
    data: { isActive: false },
  });
  if (offer.count === 0) {
    return NextResponse.json({ error: 'Teklif bulunamadı' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
} 