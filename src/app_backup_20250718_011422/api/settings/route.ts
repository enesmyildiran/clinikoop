import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Ayarları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      // Belirli bir ayarı getir
      const setting = await prisma.setting.findUnique({
        where: { key }
      });

      if (!setting) {
        return NextResponse.json(
          { success: false, error: 'Ayar bulunamadı' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: setting
      });
    }

    // Tüm ayarları getir
    const settings = await prisma.setting.findMany({
      orderBy: { key: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Ayarlar getirilirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Ayarlar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST: Ayar kaydet/güncelle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Ayar anahtarı zorunludur' },
        { status: 400 }
      );
    }

    // Ayarı kaydet veya güncelle
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });

    return NextResponse.json({
      success: true,
      data: setting
    });
  } catch (error) {
    console.error('Ayar kaydedilirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Ayar kaydedilemedi' },
      { status: 500 }
    );
  }
}

// PUT: Toplu ayar güncelleme
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz ayar formatı' },
        { status: 400 }
      );
    }

    const results = [];

    for (const setting of settings) {
      const { key, value } = setting;
      
      if (key) {
        const result = await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        });
        results.push(result);
      }
    }

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Toplu ayar güncellenirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Ayarlar güncellenemedi' },
      { status: 500 }
    );
  }
} 