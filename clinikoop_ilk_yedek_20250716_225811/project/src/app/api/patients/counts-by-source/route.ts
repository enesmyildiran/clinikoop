import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Geçici mock data - Prisma client güncellenince gerçek veri kullanılacak
    const mockCounts = {
      '1': 5,  // Google - 5 hasta
      '2': 3,  // Instagram - 3 hasta
      '3': 2   // Facebook - 2 hasta
    };

    return NextResponse.json(mockCounts);
  } catch (error) {
    console.error('Error getting patient counts:', error);
    return NextResponse.json({ error: 'Hasta sayıları alınırken hata oluştu' }, { status: 500 });
  }
} 