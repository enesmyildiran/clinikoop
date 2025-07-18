import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const priorities = await prisma.supportPriority.findMany({
      where: { isActive: true },
      orderBy: { level: 'asc' }
    });

    return NextResponse.json(priorities);
  } catch (error) {
    console.error('Support Priorities API Error:', error);
    return NextResponse.json(
      { error: 'Öncelikler getirilirken hata oluştu' },
      { status: 500 }
    );
  }
} 