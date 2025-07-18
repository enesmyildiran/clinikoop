import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateStatusSchema = z.object({
  name: z.string().min(1).optional(),
  displayName: z.string().min(1).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  order: z.number().int().min(0).optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const status = await prisma.offerStatus.findUnique({
      where: { id: params.id },
    })

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Durum bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error('Error fetching offer status:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateStatusSchema.parse(body)

    // Eğer bu durum varsayılan olarak işaretleniyorsa, diğerlerini varsayılan olmaktan çıkar
    if (validatedData.isDefault) {
      await prisma.offerStatus.updateMany({
        where: { 
          isDefault: true,
          id: { not: params.id }
        },
        data: { isDefault: false }
      })
    }

    const status = await prisma.offerStatus.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error('Error updating offer status:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz veri', errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Önce bu durumu kullanan teklifleri kontrol et
    const offersWithStatus = await prisma.offer.count({
      where: { statusId: params.id }
    })

    if (offersWithStatus > 0) {
      return NextResponse.json(
        { success: false, message: 'Bu durum kullanımda olduğu için silinemez' },
        { status: 400 }
      )
    }

    // Varsayılan durum silinmeye çalışılıyorsa engelle
    const status = await prisma.offerStatus.findUnique({
      where: { id: params.id }
    })

    if (status?.isDefault) {
      return NextResponse.json(
        { success: false, message: 'Varsayılan durum silinemez' },
        { status: 400 }
      )
    }

    await prisma.offerStatus.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting offer status:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 