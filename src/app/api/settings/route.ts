import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getClinicIdFromRequest } from '@/lib/clinic-routing';

// GET: Ayarları getir
export async function GET(request: NextRequest) {
  try {
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(request);
    
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      // Belirli bir ayarı getir
      if (clinicId) {
        // ClinicSetting'den getir
        const setting = await prisma.clinicSetting.findUnique({
          where: { 
            clinicId_key: {
              clinicId: clinicId,
              key: key
            }
          }
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
      } else {
        // Global Setting'den getir
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
    }

    // Tüm ayarları getir
    if (clinicId) {
      // ClinicSetting'den getir
      const settings = await prisma.clinicSetting.findMany({
        where: { clinicId: clinicId },
        orderBy: { key: 'asc' }
      });

      return NextResponse.json({
        success: true,
        data: settings
      });
    } else {
      // Global Setting'den getir
      const settings = await prisma.setting.findMany({
        orderBy: { key: 'asc' }
      });

      return NextResponse.json({
        success: true,
        data: settings
      });
    }
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
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(request);
    
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Ayar anahtarı zorunludur' },
        { status: 400 }
      );
    }

    if (clinicId) {
      // ClinicSetting'e kaydet
      const setting = await prisma.clinicSetting.upsert({
        where: { 
          clinicId_key: {
            clinicId: clinicId,
            key: key
          }
        },
        update: { value },
        create: { 
          key, 
          value, 
          clinicId: clinicId 
        }
      });

      return NextResponse.json({
        success: true,
        data: setting
      });
    } else {
      // Global Setting'e kaydet
      const setting = await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });

      return NextResponse.json({
        success: true,
        data: setting
      });
    }
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
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(request);
    
    const body = await request.json();
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz ayar formatı' },
        { status: 400 }
      );
    }

    const results = [];

    if (clinicId) {
      // ClinicSetting'e toplu kaydet
      for (const setting of settings) {
        const { key, value } = setting;
        
        if (key) {
          const result = await prisma.clinicSetting.upsert({
            where: { 
              clinicId_key: {
                clinicId: clinicId,
                key: key
              }
            },
            update: { value },
            create: { 
              key, 
              value, 
              clinicId: clinicId 
            }
          });
          results.push(result);
        }
      }
    } else {
      // Global Setting'e toplu kaydet
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