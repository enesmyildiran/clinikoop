import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Klinik detayını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clinic = await prisma.clinic.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            patients: true,
            offers: true,
            users: true,
          },
        },
      },
    });

    if (!clinic) {
      return NextResponse.json(
        { message: 'Klinik bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(clinic);
  } catch (error) {
    console.error('Klinik detayı getirilirken hata:', error);
    return NextResponse.json(
      { message: 'Klinik detayı getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT: Klinik güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, subdomain, domain, maxUsers, maxPatients, maxOffers, isActive } = body;

    // Validasyon
    if (!name || !subdomain) {
      return NextResponse.json(
        { message: 'Klinik adı ve subdomain zorunludur' },
        { status: 400 }
      );
    }

    // Subdomain formatını kontrol et
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json(
        { message: 'Subdomain sadece küçük harf, rakam ve tire içerebilir' },
        { status: 400 }
      );
    }

    // Subdomain uzunluğunu kontrol et
    if (subdomain.length < 3 || subdomain.length > 50) {
      return NextResponse.json(
        { message: 'Subdomain 3-50 karakter arasında olmalıdır' },
        { status: 400 }
      );
    }

    // Subdomain benzersizliğini kontrol et (kendi ID'si hariç)
    const existingClinic = await prisma.clinic.findFirst({
      where: {
        subdomain,
        id: { not: params.id },
      },
    });

    if (existingClinic) {
      return NextResponse.json(
        { message: 'Bu subdomain zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Domain formatını kontrol et (eğer varsa)
    if (domain) {
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(domain)) {
        return NextResponse.json(
          { message: 'Geçersiz domain formatı' },
          { status: 400 }
        );
      }
    }

    // Limitleri kontrol et
    if (maxUsers < 1 || maxUsers > 100) {
      return NextResponse.json(
        { message: 'Maksimum kullanıcı sayısı 1-100 arasında olmalıdır' },
        { status: 400 }
      );
    }

    if (maxPatients < 1 || maxPatients > 10000) {
      return NextResponse.json(
        { message: 'Maksimum hasta sayısı 1-10000 arasında olmalıdır' },
        { status: 400 }
      );
    }

    if (maxOffers < 1 || maxOffers > 10000) {
      return NextResponse.json(
        { message: 'Maksimum teklif sayısı 1-10000 arasında olmalıdır' },
        { status: 400 }
      );
    }

    // Klinik güncelle
    const updatedClinic = await prisma.clinic.update({
      where: { id: params.id },
      data: {
        name,
        subdomain,
        domain: domain || null,
        maxUsers,
        maxPatients,
        maxOffers,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            patients: true,
            offers: true,
            users: true,
          },
        },
      },
    });

    return NextResponse.json(updatedClinic);
  } catch (error) {
    console.error('Klinik güncellenirken hata:', error);
    return NextResponse.json(
      { message: 'Klinik güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE: Klinik sil (opsiyonel)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Klinik var mı kontrol et
    const clinic = await prisma.clinic.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            patients: true,
            offers: true,
            users: true,
          },
        },
      },
    });

    if (!clinic) {
      return NextResponse.json(
        { message: 'Klinik bulunamadı' },
        { status: 404 }
      );
    }

    // Klinikte veri var mı kontrol et
    if (clinic._count.patients > 0 || clinic._count.offers > 0 || clinic._count.users > 0) {
      return NextResponse.json(
        { 
          message: 'Bu klinik silinemez çünkü hastalar, teklifler veya kullanıcılar bulunuyor. Önce bu verileri silin.' 
        },
        { status: 400 }
      );
    }

    // Klinik sil
    await prisma.clinic.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Klinik başarıyla silindi' });
  } catch (error) {
    console.error('Klinik silinirken hata:', error);
    return NextResponse.json(
      { message: 'Klinik silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 