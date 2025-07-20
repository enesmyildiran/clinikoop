import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getClinicIdFromRequest } from '@/lib/clinic-routing';

export async function GET(request: NextRequest) {
  try {
    const clinicId = await getClinicIdFromRequest(request);
    
    if (!clinicId) {
      return NextResponse.json(
        { error: 'Klinik bilgisi bulunamadı' },
        { status: 400 }
      );
    }

    const sources = await prisma.referralSource.findMany({
      where: { 
        isActive: true,
        clinicId: clinicId
      },
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
    const clinicId = await getClinicIdFromRequest(req);
    
    if (!clinicId) {
      return NextResponse.json(
        { error: 'Klinik bilgisi bulunamadı' },
        { status: 400 }
      );
    }

    const data = await req.json();
    const created = await prisma.referralSource.create({
      data: {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        color: data.color,
        order: data.order,
        isActive: data.isActive ?? true,
        clinicId: clinicId
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
    const clinicId = await getClinicIdFromRequest(req);
    
    if (!clinicId) {
      return NextResponse.json(
        { error: 'Klinik bilgisi bulunamadı' },
        { status: 400 }
      );
    }

    const data = await req.json();
    
    const updated = await prisma.referralSource.update({
      where: { 
        id: data.id,
        clinicId: clinicId
      },
      data: {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        color: data.color,
        order: data.order,
        isActive: data.isActive
      }
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Kaynak güncellenirken hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const clinicId = await getClinicIdFromRequest(req);
    
    if (!clinicId) {
      return NextResponse.json(
        { error: 'Klinik bilgisi bulunamadı' },
        { status: 400 }
      );
    }

    const { id } = await req.json();
    
    await prisma.referralSource.delete({
      where: { 
        id: id,
        clinicId: clinicId
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Kaynak silinirken hata oluştu' }, { status: 500 });
  }
} 