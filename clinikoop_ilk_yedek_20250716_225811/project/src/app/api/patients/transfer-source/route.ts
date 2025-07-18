import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { patients } = await request.json();

    // Geçici mock response - Prisma client güncellenince gerçek işlem yapılacak
    console.log('Transferring patients:', patients);

    return NextResponse.json({ 
      success: true, 
      message: 'Hastalar başarıyla aktarıldı',
      transferred: Object.keys(patients).length
    });
  } catch (error) {
    console.error('Error transferring patients:', error);
    return NextResponse.json({ error: 'Hasta aktarma işlemi başarısız' }, { status: 500 });
  }
} 