import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const clinics = await prisma.clinic.findMany({
      select: {
        id: true,
        name: true,
        subdomain: true,
        domain: true,
        isActive: true,
        maxUsers: true,
        maxPatients: true,
        maxOffers: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true
          }
        },
        packages: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true
          }
        },
        _count: {
          select: {
            patients: true,
            offers: true,
            users: true,
            activityLogs: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ clinics });

  } catch (error) {
    console.error('Clinics API Error:', error);
    return NextResponse.json(
      { error: 'Klinikler getirilirken hata oluştu' },
      { status: 500 }
    );
  }
} 