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
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(request);
    
    // Filtreleme koşullarını hazırla
    const whereClause: any = {
      isActive: true,
    };
    
    // Eğer clinicId varsa, sadece o kliniğin tekliflerini getir
    if (clinicId) {
      whereClause.clinicId = clinicId;
    }

    const offers = await prisma.offer.findMany({
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
    })

    return NextResponse.json({ success: true, offers })
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: OfferData = await req.json();
    
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(req);
    if (!clinicId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Klinik bilgisi bulunamadı.' 
      }, { status: 400 });
    }
    
    // Kullanıcı oluştur veya mevcut kullanıcıyı bul
    let user = await prisma.clinicUser.findFirst({
      where: {
        email: 'admin@clinikoop.com',
        clinicId: clinicId,
      },
    });

    if (!user) {
      user = await prisma.clinicUser.create({
        data: {
          email: 'admin@clinikoop.com',
          name: 'Admin User',
          role: 'ADMIN',
          password: 'hashedpassword', // Gerçek uygulamada hash'lenmiş olmalı
          clinicId: clinicId,
        },
      });
    }

    // Önce hasta oluştur veya mevcut hastayı bul
    let patient = await prisma.patient.findFirst({
      where: {
        phone: body.patientInfo.phone,
        clinicId: clinicId,
        isActive: true,
      },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name: `${body.patientInfo.firstName} ${body.patientInfo.lastName}`,
          email: body.patientInfo.email,
          phone: body.patientInfo.phone,
          notes: body.patientInfo.specialNotes,
          clinicId: clinicId,
          createdById: user.id,
        },
      });
    }

    // Slug oluştur
    const slug = body.slug || `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

    // Teklif oluştur
    const totalPrice = parseFloat(body.treatmentDetails.reduce((sum, detail) => 
      sum + detail.toothPricing.reduce((sum, tp) => sum + tp.totalPrice, 0), 0
    ).toFixed(2));
    const currency = body.treatmentDetails[0]?.toothPricing[0]?.currency || 'TRY';
    const vatRate = 20;
    const vatAmount = parseFloat((totalPrice * vatRate / 100).toFixed(2));
    const grandTotal = parseFloat((totalPrice + vatAmount).toFixed(2));

    const offer = await prisma.offer.create({
      data: {
        slug: slug,
        title: `${body.patientInfo.firstName} ${body.patientInfo.lastName} - Tedavi Teklifi`,
        description: body.treatmentDetails.map(t => t.treatmentName).join(', '),
        totalPrice: totalPrice,
        currency: currency,
        statusId: defaultStatus.id,
        clinicId: clinicId,
        createdById: user.id,
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

    // Metrikleri kaydet
    offersCreated.inc({ clinic_id: clinicId, status: defaultStatus.name });

    // Tedavileri oluştur
    for (const treatmentDetail of body.treatmentDetails) {
      const totalTreatmentPrice = treatmentDetail.toothPricing.reduce((sum, tp) => sum + tp.totalPrice, 0);
      
      await prisma.treatment.create({
        data: {
          name: treatmentDetail.treatmentName,
          description: treatmentDetail.notes,
          price: totalTreatmentPrice,
          quantity: treatmentDetail.selectedTeeth.length,
          offerId: offer.id,
          selectedTeeth: JSON.stringify(treatmentDetail.selectedTeeth),
          estimatedDuration: treatmentDetail.estimatedDays || 0,
        },
      });
    }

    // Özel notlar varsa Note olarak ekle
    if (body.patientInfo.specialNotes) {
      await prisma.note.create({
        data: {
          title: 'Özel Notlar',
          content: body.patientInfo.specialNotes,
          isPrivate: true,
          offerId: offer.id,
          userId: user.id,
          clinicId: clinicId,
        },
      });
    }

    // Şablon ve doğrulama bilgilerini ClinicSetting olarak kaydet
    if (body.selectedTemplate) {
      await prisma.clinicSetting.upsert({
        where: { 
          clinicId_key: {
            clinicId: clinicId,
            key: `offer_${offer.id}_template`
          }
        },
        update: { value: body.selectedTemplate },
        create: {
          key: `offer_${offer.id}_template`,
          value: body.selectedTemplate,
          clinicId: clinicId,
        },
      });
    }

    if (body.verificationMethod && body.verificationValue) {
      await prisma.clinicSetting.upsert({
        where: { 
          clinicId_key: {
            clinicId: clinicId,
            key: `offer_${offer.id}_verification`
          }
        },
        update: { 
          value: JSON.stringify({
            method: body.verificationMethod,
            value: body.verificationValue,
          })
        },
        create: {
          key: `offer_${offer.id}_verification`,
          value: JSON.stringify({
            method: body.verificationMethod,
            value: body.verificationValue,
          }),
          clinicId: clinicId,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      offer,
      slug: offer.slug,
      message: body.status === 'draft' ? 'Teklif taslak olarak kaydedildi' : 'Teklif başarıyla gönderildi'
    });
  } catch (error) {
    console.error('Teklif kaydetme hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Teklif kaydedilemedi.' 
    }, { status: 400 });
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