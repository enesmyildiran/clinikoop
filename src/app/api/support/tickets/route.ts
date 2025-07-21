import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getClinicIdFromRequest } from '@/lib/clinic-routing';

// Destek talepleri listesi
export async function GET(request: Request) {
  try {
    const clinicId = await getClinicIdFromRequest(request);
    if (!clinicId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Klinik bilgisi bulunamadı.' 
      }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');

    const where: any = {
      clinicId: clinicId
    };
    
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
    const clinicId = await getClinicIdFromRequest(request);
    if (!clinicId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Klinik bilgisi bulunamadı.' 
      }, { status: 400 });
    }

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

    const createdById = user.id;

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
    let defaultStatus = await prisma.supportStatus.findFirst({
      where: { name: 'Açık', clinicId }
    });

    if (!defaultStatus) {
      // Eğer yoksa otomatik oluştur
      defaultStatus = await prisma.supportStatus.create({
        data: {
          name: 'Açık',
          displayName: 'Açık',
          color: '#10B981',
          order: 1,
          isActive: true,
          clinicId
        }
      });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        subject,
        description,
        isUrgent,
        clinicId,
        createdById: createdById,
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