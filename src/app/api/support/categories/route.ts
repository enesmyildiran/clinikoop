import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.supportCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Support Categories API Error:', error);
    return NextResponse.json(
      { error: 'Kategoriler getirilirken hata oluştu' },
      { status: 500 }
    );
  }
} 