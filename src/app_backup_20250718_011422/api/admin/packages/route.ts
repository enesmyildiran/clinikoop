import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET: Tüm paketleri listele
export async function GET() {
  try {
    const packages = await prisma.clinicPackage.findMany({
      include: {
        clinics: {
          select: {
            id: true,
            name: true,
            subdomain: true,
          }
        },
        _count: {
          select: {
            clinics: true,
          }
        }
      },
      orderBy: {
        price: 'asc'
      }
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Paket listesi alınırken hata:', error);
    return NextResponse.json(
      { error: 'Paket listesi alınamadı' },
      { status: 500 }
    );
  }
}

// POST: Yeni paket oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, features, price, currency, duration } = body;

    // Validasyon
    if (!name || !features || !price || !duration) {
      return NextResponse.json(
        { error: 'Tüm alanlar gereklidir' },
        { status: 400 }
      );
    }

    // Features array kontrolü
    if (!Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Özellikler array formatında olmalıdır' },
        { status: 400 }
      );
    }

    // Paket oluştur
    const packageData = await prisma.clinicPackage.create({
      data: {
        name,
        features: JSON.stringify(features),
        price: parseFloat(price),
        currency: currency || 'TRY',
        duration: parseInt(duration),
      },
      include: {
        clinics: true,
      }
    });

    return NextResponse.json({ 
      package: packageData,
      message: 'Paket başarıyla oluşturuldu' 
    });
  } catch (error) {
    console.error('Paket oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Paket oluşturulamadı' },
      { status: 500 }
    );
  }
} 