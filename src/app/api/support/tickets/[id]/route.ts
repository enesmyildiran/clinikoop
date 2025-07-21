import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getClinicIdFromRequest } from '@/lib/clinic-routing';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// Destek talebi detayını getir
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

    const ticket = await prisma.supportTicket.findFirst({
      where: { 
        id: id,
        clinicId: clinicId 
      },
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
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Destek talebi bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Support Ticket Fetch Error:', error);
    return NextResponse.json(
      { error: 'Destek talebi yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Destek talebi güncelle
export async function PATCH(
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

    // Session ve rol kontrolü
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;
    const isSuperAdmin = session?.user?.isSuperAdmin;

    const { id } = params;
    const body = await request.json();
    const { statusId, priorityId, assignedToId, isUrgent } = body;

    // Ticket'ın bu kliniğe ait olduğunu kontrol et
    const existingTicket = await prisma.supportTicket.findFirst({
      where: { 
        id: id,
        clinicId: clinicId 
      }
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Destek talebi bulunamadı' },
        { status: 404 }
      );
    }

    // Güncelleme verilerini hazırla
    const updateData: any = {};
    // Sadece admin/superadmin statusId güncelleyebilir
    if (statusId) {
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || isSuperAdmin) {
        updateData.statusId = statusId;
      } else {
        return NextResponse.json({ error: 'Durum güncelleme yetkiniz yok.' }, { status: 403 });
      }
    }
    if (priorityId) updateData.priorityId = priorityId;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId;
    if (isUrgent !== undefined) updateData.isUrgent = isUrgent;

    const ticket = await prisma.supportTicket.update({
      where: { 
        id: id,
        clinicId: clinicId 
      },
      data: updateData,
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
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Support Ticket Update Error:', error);
    return NextResponse.json(
      { error: 'Destek talebi güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
} 