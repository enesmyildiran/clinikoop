import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const sources = await prisma.referralSource.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(sources);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Kaynaklar alınırken hata oluştu' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const created = await prisma.referralSource.create({
      data: {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        color: data.color,
        order: data.order,
        isActive: data.isActive ?? true,
      }
    });
    return NextResponse.json(created);
  } catch (error) {
    console.error('ReferralSource POST error:', error);
    return NextResponse.json({ error: 'Kaynak oluşturulurken hata oluştu' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    // Geçici olarak başarılı yanıt döndür
    const updated = { ...data, updatedAt: new Date().toISOString() };
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Kaynak güncellenirken hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    
    // Geçici olarak başarılı yanıt döndür
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Kaynak silinirken hata oluştu' }, { status: 500 });
  }
} 