import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Destek talebi mesajlarını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const messages = await prisma.supportMessage.findMany({
      where: { ticketId: id },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Support Messages Fetch Error:', error);
    return NextResponse.json(
      { error: 'Mesajlar yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Yeni mesaj gönder
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content, authorId, authorName, authorType } = body;

    // Validasyon
    if (!content || !authorName || !authorType) {
      return NextResponse.json(
        { error: 'Mesaj içeriği ve gönderen bilgileri gerekli' },
        { status: 400 }
      );
    }

    // Ticket'ın var olduğunu kontrol et
    const ticket = await prisma.supportTicket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Destek talebi bulunamadı' },
        { status: 404 }
      );
    }

    const message = await prisma.supportMessage.create({
      data: {
        ticketId: id,
        authorId: authorId || null,
        authorName,
        authorType,
        content
      }
    });

    // Ticket'ın son güncelleme zamanını güncelle
    await prisma.supportTicket.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Support Message Creation Error:', error);
    return NextResponse.json(
      { error: 'Mesaj gönderilirken hata oluştu' },
      { status: 500 }
    );
  }
} 