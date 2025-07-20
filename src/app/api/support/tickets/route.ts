import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Destek talepleri listesi
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');

    const where: any = {};
    
    if (clinicId) {
      where.clinicId = clinicId;
    }
    
    if (status) {
      where.status = { name: status };
    }
    
    if (category) {
      where.category = { name: category };
    }
    
    if (priority) {
      where.priority = { name: priority };
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        clinic: {
          select: { name: true, subdomain: true }
        },
        createdBy: {
          select: { name: true, email: true }
        },
        assignedTo: {
          select: { name: true, email: true }
        },
        category: true,
        priority: true,
        status: true,
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Support Tickets API Error:', error);
    return NextResponse.json(
      { error: 'Destek talepleri getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Yeni destek talebi oluşturma
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      subject,
      description,
      categoryId,
      priorityId,
      isUrgent = false
    } = body;

    // Validasyon
    if (!subject || !description || !categoryId || !priorityId) {
      return NextResponse.json(
        { error: 'Tüm gerekli alanlar doldurulmalıdır' },
        { status: 400 }
      );
    }

    // İlk aktif kliniği bul
    const firstClinic = await prisma.clinic.findFirst({
      where: { isActive: true },
      select: { id: true }
    });

    if (!firstClinic) {
      return NextResponse.json(
        { error: 'Aktif klinik bulunamadı' },
        { status: 400 }
      );
    }

    // Herhangi bir kullanıcıyı bul (klinik fark etmez)
    const firstUser = await prisma.clinicUser.findFirst({
      where: { isActive: true },
      select: { id: true }
    });

    if (!firstUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 400 }
      );
    }

    const clinicId = firstClinic.id;
    const createdById = firstUser.id;

    // Ticket numarası oluştur (TKT-2025-001 formatında)
    const year = new Date().getFullYear();
    const lastTicket = await prisma.supportTicket.findFirst({
      where: {
        ticketNumber: {
          startsWith: `TKT-${year}-`
        }
      },
      orderBy: { ticketNumber: 'desc' }
    });

    let ticketNumber = `TKT-${year}-001`;
    if (lastTicket) {
      const lastNumber = parseInt(lastTicket.ticketNumber.split('-')[2]);
      ticketNumber = `TKT-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // Varsayılan durum (Açık)
    const defaultStatus = await prisma.supportStatus.findFirst({
      where: { name: 'Açık' }
    });

    if (!defaultStatus) {
      return NextResponse.json(
        { error: 'Varsayılan durum bulunamadı' },
        { status: 500 }
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        title: subject, // title alanı için subject kullanıyoruz
        subject,
        description,
        isUrgent,
        clinicId,
        authorId: createdById, // authorId alanı için createdById kullanıyoruz
        createdById: createdById, // createdById de aynı kullanıcı
        categoryId,
        priorityId,
        statusId: defaultStatus.id
      },
      include: {
        clinic: {
          select: { name: true, subdomain: true }
        },
        createdBy: {
          select: { name: true, email: true }
        },
        category: true,
        priority: true,
        status: true
      }
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error('Support Ticket Creation Error:', error);
    return NextResponse.json(
      { error: 'Destek talebi oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
} 