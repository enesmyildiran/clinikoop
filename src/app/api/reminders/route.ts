import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const reminderSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  dueDate: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  isPrivate: z.boolean().optional(),
  userId: z.string(),
  offerId: z.string().optional(),
  patientId: z.string().optional(),
});

// GET /api/reminders - Hatırlatmaları listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const patientId = searchParams.get('patientId');
    const userId = searchParams.get('userId');
    const today = searchParams.get('today') === 'true';

    let where: any = {};

    // Status filtresi
    if (status) {
      where.status = status;
    }

    // Patient filtresi
    if (patientId) {
      where.patientId = patientId;
    }

    // User filtresi
    if (userId) {
      where.userId = userId;
    }

    // Bugünkü hatırlatmalar
    if (today) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      
      where.dueDate = {
        gte: todayStart,
        lte: todayEnd
      };
    }

    const reminders = await prisma.reminder.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        },
        offer: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    // Eğer hiç veri yoksa da boş dizi dön
    return NextResponse.json({ success: true, reminders: reminders ?? [] });
  } catch (error) {
    console.error('Reminder list error:', error);
    return NextResponse.json(
      { success: false, error: 'Hatırlatmalar listelenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/reminders - Yeni hatırlatma oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, dueDate, patientId, offerId, priority, isPrivate } = body;

    // Gerekli alanları kontrol et
    if (!title || !dueDate) {
      return NextResponse.json(
        { success: false, error: 'Başlık ve tarih alanları zorunludur' },
        { status: 400 }
      );
    }

    // Mock user ID - gerçek uygulamada auth'dan gelecek
    // Eğer veritabanında bir kullanıcı varsa onu kullan
    let userId = 'mock-user-id';
    const user = await prisma.user.findFirst();
    if (user) userId = user.id;

    // Tarih validasyonu
    let parsedDueDate: Date;
    try {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Geçersiz tarih formatı' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz tarih formatı' },
        { status: 400 }
      );
    }

    // patientId ve offerId boş string ise undefined yap
    const data: any = {
      title,
      description,
      dueDate: parsedDueDate,
      patientId: patientId && patientId !== '' ? patientId : undefined,
      offerId: offerId && offerId !== '' ? offerId : undefined,
      priority: priority || 'MEDIUM',
      isPrivate: isPrivate || false,
      userId
    };

    const reminder = await prisma.reminder.create({
      data,
      include: {
        patient: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, reminder });
  } catch (error) {
    console.error('Reminder create error:', error);
    return NextResponse.json(
      { success: false, error: 'Hatırlatma oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
} 