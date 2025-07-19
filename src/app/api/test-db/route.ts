import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Database bağlantısını test et
    await prisma.$connect();
    
    // Basit bir sorgu yap
    const clinicCount = await prisma.clinic.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database bağlantısı başarılı',
      clinicCount,
      databaseUrl: process.env.DATABASE_URL ? 'Ayarlandı' : 'Ayarlandı değil',
      nodeEnv: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      databaseUrl: process.env.DATABASE_URL ? 'Ayarlandı' : 'Ayarlandı değil',
      nodeEnv: process.env.NODE_ENV
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 