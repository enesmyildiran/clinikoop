import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getClinicIdFromRequest } from '@/lib/clinic-routing'

// PUT /api/reminders/[id] - Hatırlatma güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, dueDate, isCompleted, isPinned } = body

    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(request)
    
    // Hatırlatmanın var olup olmadığını kontrol et (clinicId ile)
    const existingReminder = await prisma.reminder.findFirst({
      where: { 
        id,
        clinicId: clinicId || undefined
      }
    })

    if (!existingReminder) {
      return NextResponse.json(
        { success: false, error: 'Hatırlatma bulunamadı' },
        { status: 404 }
      )
    }

    // Güncelleme verilerini hazırla
    const updateData: any = {}
    
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate)
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted
    if (isPinned !== undefined) updateData.isPinned = isPinned

    const reminder = await prisma.reminder.update({
      where: { id },
      data: updateData,
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
      }
    })

    return NextResponse.json({ success: true, reminder })
  } catch (error) {
    console.error('Reminder update error:', error)
    return NextResponse.json(
      { success: false, error: 'Hatırlatma güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE /api/reminders/[id] - Hatırlatma sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(request)

    // Hatırlatmanın var olup olmadığını kontrol et (clinicId ile)
    const existingReminder = await prisma.reminder.findFirst({
      where: { 
        id,
        clinicId: clinicId || undefined
      }
    })

    if (!existingReminder) {
      return NextResponse.json(
        { success: false, error: 'Hatırlatma bulunamadı' },
        { status: 404 }
      )
    }

    await prisma.reminder.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Hatırlatma başarıyla silindi' })
  } catch (error) {
    console.error('Reminder delete error:', error)
    return NextResponse.json(
      { success: false, error: 'Hatırlatma silinirken hata oluştu' },
      { status: 500 }
    )
  }
}

// GET /api/reminders/[id] - Tekil hatırlatma getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(request)

    const reminder = await prisma.reminder.findFirst({
      where: { 
        id,
        clinicId: clinicId || undefined
      },
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
      }
    })

    if (!reminder) {
      return NextResponse.json(
        { success: false, error: 'Hatırlatma bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, reminder })
  } catch (error) {
    console.error('Reminder get error:', error)
    return NextResponse.json(
      { success: false, error: 'Hatırlatma getirilirken hata oluştu' },
      { status: 500 }
    )
  }
} 