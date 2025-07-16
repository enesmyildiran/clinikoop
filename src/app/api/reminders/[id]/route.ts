import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// PUT /api/reminders/[id] - Hatırlatma güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, dueDate, status, reason, priority, isPrivate, isPinned } = body

    // Hatırlatmanın var olup olmadığını kontrol et
    const existingReminder = await prisma.reminder.findUnique({
      where: { id }
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
    if (status !== undefined) updateData.status = status
    if (reason !== undefined) updateData.reason = reason
    if (priority !== undefined) updateData.priority = priority
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate
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

    // Hatırlatmanın var olup olmadığını kontrol et
    const existingReminder = await prisma.reminder.findUnique({
      where: { id }
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

    const reminder = await prisma.reminder.findUnique({
      where: { id },
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