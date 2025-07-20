import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getClinicIdFromRequest } from '@/lib/clinic-routing';

// Destek talebi mesajlarını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clinicId = await getClinicIdFromRequest(request);
    if (!clinicId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Klinik bilgisi bulunamadı.' 
      }, { status: 400 });
    }

    const { id } = params;

    // Önce ticket'ın bu kliniğe ait olduğunu kontrol et
    const ticket = await prisma.supportTicket.findFirst({
      where: { 
        id: id,
        clinicId: clinicId 
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Destek talebi bulunamadı' },
        { status: 404 }
      );
    }

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
    const clinicId = await getClinicIdFromRequest(request);
    if (!clinicId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Klinik bilgisi bulunamadı.' 
      }, { status: 400 });
    }

    const { id } = params;
    const body = await request.json();
    const { content, authorName, authorType } = body;

    // Validasyon
    if (!content || !authorName || !authorType) {
      return NextResponse.json(
        { error: 'Mesaj içeriği ve gönderen bilgileri gerekli' },
        { status: 400 }
      );
    }

    // Ticket'ın bu kliniğe ait olduğunu kontrol et
    const ticket = await prisma.supportTicket.findFirst({
      where: { 
        id: id,
        clinicId: clinicId 
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Destek talebi bulunamadı' },
        { status: 404 }
      );
    }

    // Klinik kullanıcısını bul
    const user = await prisma.clinicUser.findFirst({
      where: { 
        clinicId: clinicId,
        isActive: true 
      },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Klinik kullanıcısı bulunamadı' },
        { status: 400 }
      );
    }

    const message = await prisma.supportMessage.create({
      data: {
        ticketId: id,
        authorId: user.id,
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