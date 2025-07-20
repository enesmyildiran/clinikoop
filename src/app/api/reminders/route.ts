import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getClinicIdFromRequest } from '@/lib/clinic-routing';
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
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(request);
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const patientId = searchParams.get('patientId');
    const userId = searchParams.get('userId');
    const today = searchParams.get('today') === 'true';

    let where: any = {};

    // ClinicId filtresi
    if (clinicId) {
      where.user = {
        clinicId: clinicId
      };
    }

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
    // ClinicId'yi al - eğer bulunamazsa ilk kliniği kullan
    let clinicId: string | null = await getClinicIdFromRequest(request);
    if (!clinicId) {
      // İlk aktif kliniği bul
      const firstClinic = await prisma.clinic.findFirst({
        where: { isActive: true },
        select: { id: true }
      });
      clinicId = firstClinic?.id || null;
      
      if (!clinicId) {
        return NextResponse.json({ 
          success: false, 
          error: 'Hiç aktif klinik bulunamadı.' 
        }, { status: 400 });
      }
    }
    
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
    let userId = 'mock-user-id';
    let user = await prisma.clinicUser.findFirst({
      where: { clinicId: clinicId }
    });
    if (!user) {
      // Eğer kullanıcı yoksa otomatik admin oluştur
      user = await prisma.clinicUser.create({
        data: {
          email: 'admin@clinikoop.com',
          name: 'Admin User',
          password: '$2a$10$hashedpassword', // bcrypt ile hashlenmiş dummy şifre
          role: 'ADMIN',
          clinicId: clinicId,
          isActive: true
        }
      });
    }
    userId = user.id;

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

    // patientId validasyonu - eğer geçerli bir hasta ID'si değilse undefined yap
    let validPatientId = undefined;
    if (patientId && patientId !== '') {
      const patient = await prisma.patient.findFirst({
        where: { 
          id: patientId,
          clinicId: clinicId,
          isActive: true
        }
      });
      if (patient) {
        validPatientId = patientId;
      }
    }

    // offerId validasyonu - eğer geçerli bir teklif ID'si değilse undefined yap
    let validOfferId = undefined;
    if (offerId && offerId !== '') {
      const offer = await prisma.offer.findFirst({
        where: { 
          id: offerId,
          clinicId: clinicId,
          isActive: true
        }
      });
      if (offer) {
        validOfferId = offerId;
      }
    }

    // priorityId validasyonu
    let validPriorityId = null;
    if (priority && priority !== '') {
      const priorityRecord = await prisma.supportPriority.findFirst({
        where: { id: priority }
      });
      if (priorityRecord) {
        validPriorityId = priority;
      }
    }

    const data: any = {
      title,
      description,
      dueDate: parsedDueDate,
      patientId: validPatientId,
      offerId: validOfferId,
      priorityId: validPriorityId,
      isPrivate: isPrivate || false,
      userId,
      clinicId
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