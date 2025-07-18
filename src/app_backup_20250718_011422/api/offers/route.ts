import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
    const offers = await prisma.offer.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            isDeleted: true,
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
    
    // Önce hasta oluştur veya mevcut hastayı bul
    let patient = await prisma.patient.findFirst({
      where: {
        phone: body.patientInfo.phone,
        isDeleted: false,
      },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name: `${body.patientInfo.firstName} ${body.patientInfo.lastName}`,
          email: body.patientInfo.email,
          phone: body.patientInfo.phone,
          notes: body.patientInfo.specialNotes,
        },
      });
    }

    // Kullanıcı oluştur veya mevcut kullanıcıyı bul
    let user = await prisma.user.findFirst({
      where: {
        email: 'admin@clinikoop.com',
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@clinikoop.com',
          name: 'Admin User',
          role: 'ADMIN',
          password: 'hashedpassword', // Gerçek uygulamada hash'lenmiş olmalı
        },
      });
    }

    // Slug oluştur
    const slug = body.slug || `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Varsayılan durumu bul
    const defaultStatus = await prisma.offerStatus.findFirst({
      where: { isDefault: true }
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
        statusId: defaultStatus.id, // Yeni durum sistemi
        patientId: patient.id,
        userId: user.id,
        validUntil: body.validUntil ? new Date(body.validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

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
          estimatedDays: treatmentDetail.estimatedDays || 0,
          estimatedHours: treatmentDetail.estimatedHours || 0,
        },
      });
    }

    // Özel notlar varsa Note olarak ekle
    if (body.patientInfo.specialNotes) {
      await prisma.note.create({
        data: {
          content: body.patientInfo.specialNotes,
          isPrivate: true,
          offerId: offer.id,
          userId: user.id,
        },
      });
    }

    // Şablon ve doğrulama bilgilerini Setting olarak kaydet
    if (body.selectedTemplate) {
      await prisma.setting.upsert({
        where: { key: `offer_${offer.id}_template` },
        update: { value: body.selectedTemplate },
        create: {
          key: `offer_${offer.id}_template`,
          value: body.selectedTemplate,
        },
      });
    }

    if (body.verificationMethod && body.verificationValue) {
      await prisma.setting.upsert({
        where: { key: `offer_${offer.id}_verification` },
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
  const offer = await prisma.offer.updateMany({
    where: { id, isDeleted: false },
    data: { isDeleted: true },
  });
  if (offer.count === 0) {
    return NextResponse.json({ error: 'Teklif bulunamadı' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
} 