import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug gerekli' }, { status: 400 });
    }

    // Teklifi slug ile bul
    const offer = await prisma.offer.findFirst({
      where: { 
        slug: slug,
        isDeleted: false
      },
      include: {
        patientOffers: {
          include: {
            patient: true
          }
        },
        treatments: true,
        notes: true,
      },
    });

    if (!offer) {
      return NextResponse.json({ error: 'Teklif bulunamadı' }, { status: 404 });
    }

    // Klinik bilgilerini settings'den al
    const clinicSettings = await prisma.setting.findMany({
      where: {
        key: {
          in: ['clinic_name', 'clinic_address', 'clinic_phone', 'clinic_email', 'clinic_website', 'clinic_slogan', 'clinic_facebook', 'clinic_instagram', 'clinic_whatsapp', 'clinic_tax_number']
        }
      }
    });

    const clinic = {
      name: clinicSettings.find(s => s.key === 'clinic_name')?.value || 'Diş Kliniği',
      address: clinicSettings.find(s => s.key === 'clinic_address')?.value || 'Adres bilgisi',
      phone: clinicSettings.find(s => s.key === 'clinic_phone')?.value || 'Telefon bilgisi',
      email: clinicSettings.find(s => s.key === 'clinic_email')?.value || 'Email bilgisi',
      website: clinicSettings.find(s => s.key === 'clinic_website')?.value || 'Website bilgisi',
      slogan: clinicSettings.find(s => s.key === 'clinic_slogan')?.value || 'Sağlıklı gülüşler için',
      facebook: clinicSettings.find(s => s.key === 'clinic_facebook')?.value,
      instagram: clinicSettings.find(s => s.key === 'clinic_instagram')?.value,
      whatsapp: clinicSettings.find(s => s.key === 'clinic_whatsapp')?.value,
      taxNumber: clinicSettings.find(s => s.key === 'clinic_tax_number')?.value,
    };

    // Doğrulama bilgilerini al
    const verificationSetting = await prisma.setting.findUnique({
      where: { key: `offer_${offer.id}_verification` },
    });

    let verificationData = null;
    if (verificationSetting) {
      try {
        verificationData = JSON.parse(verificationSetting.value);
      } catch (e) {
        console.error('Verification data parse error:', e);
      }
    }

    // Şablon bilgisini al
    const templateSetting = await prisma.setting.findUnique({
      where: { key: `offer_${offer.id}_template` },
    });

    // Teklif verilerini formatla
    const formattedOffer = {
      id: offer.id,
      slug: offer.slug,
      title: offer.title,
      description: offer.description,
      totalPrice: offer.totalPrice,
      currency: offer.currency,
      status: offer.statusId,
      createdAt: offer.createdAt,
      validUntil: offer.validUntil,
      patient: {
        name: offer.patient.name,
        email: offer.patient.email,
        phone: offer.patient.phone,
        birthDate: offer.patient.birthDate,
        address: offer.patient.address,
        notes: offer.patient.notes,
      },
      treatments: offer.treatments.map(treatment => ({
        id: treatment.id,
        name: treatment.name,
        description: treatment.description,
        price: treatment.price,
        quantity: treatment.quantity,
        selectedTeeth: treatment.selectedTeeth ? JSON.parse(treatment.selectedTeeth) : [],
        key: treatment.key,
        category: treatment.category,
        currency: treatment.currency || 'TRY',
        estimatedDays: treatment.estimatedDays,
        estimatedHours: treatment.estimatedHours,
      })),
      notes: offer.notes.map(note => ({
        id: note.id,
        content: note.content,
        isPrivate: note.isPrivate,
        createdAt: note.createdAt,
      })),
      verification: verificationData,
      template: templateSetting?.value || null,
    };

    return NextResponse.json({ 
      offer: formattedOffer,
      clinic: clinic,
      verificationMethod: verificationData?.method || null,
      verificationValue: verificationData?.value || null,
    });
  } catch (error) {
    console.error('Teklif getirme hatası:', error);
    return NextResponse.json({ 
      error: 'Teklif yüklenirken hata oluştu' 
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    const body = await req.json();
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug gerekli' }, { status: 400 });
    }

    // Teklifi slug ile bul
    const offer = await prisma.offer.findFirst({
      where: { 
        slug: slug,
        isDeleted: false 
      },
    });

    if (!offer) {
      return NextResponse.json({ error: 'Teklif bulunamadı' }, { status: 404 });
    }

    // Teklifi güncelle - sadece statusId kullan
    const updateData: any = {
      updatedAt: new Date(),
      estimatedDays: typeof body.estimatedDays === 'number' ? body.estimatedDays : offer.estimatedDays,
      estimatedHours: typeof body.estimatedHours === 'number' ? body.estimatedHours : offer.estimatedHours,
    };

    // Sadece statusId varsa ekle
    if (body.offerStatusId || body.statusId) {
      updateData.statusId = body.offerStatusId || body.statusId;
    }

    const updatedOffer = await prisma.offer.update({
      where: { id: offer.id },
      data: updateData,
    });

    // Tedavi güncelleme: önce sil, sonra ekle
    if (Array.isArray(body.treatments)) {
      await prisma.treatment.deleteMany({ where: { offerId: offer.id } });
      for (const t of body.treatments) {
        await prisma.treatment.create({
          data: {
            name: t.name,
            description: t.description || '',
            price: typeof t.price === 'number' ? t.price : 0,
            quantity: typeof t.quantity === 'number' ? t.quantity : 1,
            selectedTeeth: t.selectedTeeth ? JSON.stringify(t.selectedTeeth) : '[]',
            offerId: offer.id,
            key: t.key,
            category: t.category,
            currency: t.currency || 'TRY',
          },
        });
      }
    }

    // Doğrulama bilgilerini güncelle
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

    // Şablon bilgisini güncelle
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

    return NextResponse.json({ 
      success: true, 
      offer: updatedOffer,
      message: 'Teklif başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Teklif güncelleme hatası:', error);
    return NextResponse.json({ 
      error: 'Teklif güncellenirken hata oluştu' 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug gerekli' }, { status: 400 });
    }

    // Önce teklifi slug ile bul
    const offer = await prisma.offer.findFirst({
      where: { 
        slug: slug,
        isDeleted: false 
      },
    });

    if (!offer) {
      return NextResponse.json({ error: 'Teklif bulunamadı' }, { status: 404 });
    }

    // Soft delete yap
    const deletedOffer = await prisma.offer.updateMany({
      where: { slug, isDeleted: false },
      data: { isDeleted: true },
    });

    if (deletedOffer.count === 0) {
      return NextResponse.json({ error: 'Teklif bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Teklif silme hatası:', error);
    return NextResponse.json({ 
      error: 'Teklif silinirken hata oluştu' 
    }, { status: 500 });
  }
} 