import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const source = await prisma.referralSource.findUnique({
      where: { id: params.id }
    });

    if (!source) {
      return NextResponse.json({ error: 'Kaynak bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(source);
  } catch (error) {
    console.error('Error getting referral source:', error);
    return NextResponse.json({ error: 'Kaynak alınırken hata oluştu' }, { status: 500 });
  }
} 