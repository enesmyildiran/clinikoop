import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clinicId, dataTypes, dateRange, pageSize = 10 } = body;

    const result: any = {};

    // Klinik filtre
    const clinicFilter = clinicId ? { clinicId } : {};
    // Tarih filtreleri
    const dateFilter = dateRange ? {
      gte: new Date(dateRange.start),
      lte: new Date(dateRange.end)
    } : undefined;

    // Klinik İstatistikleri
    if (dataTypes.includes('clinicStats')) {
      try {
        const clinics = await prisma.clinic.findMany({
          select: {
            id: true,
            name: true,
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
        result.clinicStats = clinics.map(clinic => ({
          id: clinic.id,
          name: clinic.name,
          patientCount: clinic._count.patients,
          offerCount: clinic._count.offers,
          userCount: clinic._count.users,
          activityCount: clinic._count.activityLogs
        }));
      } catch (error) {
        console.error('Clinic stats error:', error);
        result.clinicStats = [];
      }
    }

    // En Aktif Kullanıcılar
    if (dataTypes.includes('activeUsers')) {
      try {
        const users = await prisma.clinicUser.findMany({
          where: clinicFilter,
          select: {
            id: true,
            name: true,
            email: true,
            clinic: { select: { name: true } },
            activityLogs: {
              where: dateRange ? { createdAt: dateFilter } : {},
              select: { id: true }
            }
          },
          orderBy: {
            activityLogs: {
              _count: 'desc'
            }
          },
          take: pageSize
        });
        result.activeUsers = users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          clinicName: user.clinic?.name || 'Bilinmeyen',
          activityCount: user.activityLogs.length
        }));
      } catch (error) {
        console.error('Active users error:', error);
        result.activeUsers = [];
      }
    }

    // Son Aktiviteler
    if (dataTypes.includes('recentActivities')) {
      try {
        const activities = await prisma.activityLog.findMany({
          where: {
            ...clinicFilter,
            createdAt: dateRange ? dateFilter : undefined
          },
          select: {
            id: true,
            action: true,
            description: true,
            entityType: true,
            createdAt: true,
            user: { select: { name: true } },
            clinic: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: pageSize
        });
        result.recentActivities = activities.map(activity => ({
          id: activity.id,
          action: activity.action,
          description: activity.description,
          entityType: activity.entityType,
          createdAt: activity.createdAt,
          userName: activity.user?.name || 'Sistem',
          clinicName: activity.clinic?.name || 'Genel'
        }));
      } catch (error) {
        console.error('ActivityLog query error:', error);
        result.recentActivities = [];
      }
    }

    // Analitik Eventler
    if (dataTypes.includes('analyticsEvents')) {
      try {
        const events = await prisma.analyticsEvent.findMany({
          where: {
            ...clinicFilter,
            timestamp: dateRange ? dateFilter : undefined
          },
          select: {
            id: true,
            eventType: true,
            eventData: true,
            timestamp: true,
            user: { select: { name: true } },
            clinic: { select: { name: true } }
          },
          orderBy: { timestamp: 'desc' },
          take: pageSize
        });
        result.analyticsEvents = events.map(event => ({
          id: event.id,
          eventType: event.eventType,
          eventData: event.eventData ? JSON.parse(event.eventData) : {},
          createdAt: event.timestamp,
          userName: event.user?.name || 'Sistem',
          clinicName: event.clinic?.name || 'Genel'
        }));
      } catch (error) {
        console.error('Analytics events error:', error);
        result.analyticsEvents = [];
      }
    }

    // Finansal Veriler
    if (dataTypes.includes('financialData')) {
      try {
        const offers = await prisma.offer.findMany({
          where: {
            isDeleted: false,
            ...clinicFilter
          },
          select: {
            id: true,
            title: true,
            totalPrice: true,
            currency: true,
            status: { select: { displayName: true, color: true } },
            createdAt: true,
            clinic: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: pageSize
        });
        result.financialData = offers.map(offer => ({
          id: offer.id,
          title: offer.title,
          totalPrice: offer.totalPrice,
          currency: offer.currency,
          status: offer.status?.displayName || 'Bilinmeyen',
          statusColor: offer.status?.color || '#6B7280',
          createdAt: offer.createdAt,
          clinicName: offer.clinic?.name || 'Bilinmeyen'
        }));
      } catch (error) {
        console.error('Financial data error:', error);
        result.financialData = [];
      }
    }

    // Randevu İstatistikleri
    if (dataTypes.includes('appointmentStats')) {
      try {
        const appointments = await prisma.appointment.findMany({
          where: dateRange ? {
            startTime: dateFilter
          } : {},
          select: {
            id: true,
            appointmentType: true,
            status: true,
            startTime: true,
            endTime: true,
            patient: { select: { name: true } },
            doctor: { select: { name: true } },
            clinic: { select: { name: true } }
          },
          orderBy: { startTime: 'desc' },
          take: pageSize
        });
        result.appointmentStats = appointments.map(appointment => ({
          id: appointment.id,
          appointmentType: appointment.appointmentType,
          status: appointment.status,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          patientName: appointment.patient?.name || '-',
          doctorName: appointment.doctor?.name || '-',
          clinicName: appointment.clinic?.name || '-'
        }));
      } catch (error) {
        console.error('Appointment stats error:', error);
        result.appointmentStats = [];
      }
    }

    // Hatırlatma İstatistikleri
    if (dataTypes.includes('reminderStats')) {
      try {
        const reminders = await prisma.reminder.findMany({
          where: dateRange ? {
            dueDate: dateFilter
          } : {},
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            status: true,
            priority: true,
            createdAt: true,
            user: { select: { name: true } },
            clinic: { select: { name: true } }
          },
          orderBy: { dueDate: 'asc' },
          take: pageSize
        });
        result.reminderStats = reminders.map(reminder => ({
          id: reminder.id,
          title: reminder.title,
          description: reminder.description,
          dueDate: reminder.dueDate,
          isCompleted: reminder.status === 'DONE',
          priority: reminder.priority,
          createdAt: reminder.createdAt,
          userName: reminder.user?.name || 'Sistem',
          clinicName: reminder.clinic?.name || 'Genel'
        }));
      } catch (error) {
        console.error('Reminder stats error:', error);
        result.reminderStats = [];
      }
    }

    // Klinik Karşılaştırması
    if (dataTypes.includes('clinicComparison')) {
      try {
        const clinics = await prisma.clinic.findMany({
          select: {
            id: true,
            name: true,
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
        result.clinicComparison = clinics.map(clinic => ({
          id: clinic.id,
          name: clinic.name,
          patientCount: clinic._count.patients,
          offerCount: clinic._count.offers,
          userCount: clinic._count.users,
          activityCount: clinic._count.activityLogs
        }));
      } catch (error) {
        console.error('Clinic comparison error:', error);
        result.clinicComparison = [];
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Analitik verileri getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}
