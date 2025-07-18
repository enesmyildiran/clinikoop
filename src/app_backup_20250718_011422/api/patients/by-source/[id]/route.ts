import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Geçici mock data - Prisma client güncellenince gerçek veri kullanılacak
    const mockPatients = [
      {
        id: '1',
        name: 'Ahmet Yılmaz',
        phone: '+90 555 123 4567',
        email: 'ahmet@example.com'
      },
      {
        id: '2',
        name: 'Fatma Demir',
        phone: '+90 555 987 6543',
        email: 'fatma@example.com'
      },
      {
        id: '3',
        name: 'Mehmet Kaya',
        phone: '+90 555 456 7890',
        email: null
      }
    ];

    return NextResponse.json(mockPatients);
  } catch (error) {
    console.error('Error getting patients by source:', error);
    return NextResponse.json({ error: 'Hastalar alınırken hata oluştu' }, { status: 500 });
  }
} 