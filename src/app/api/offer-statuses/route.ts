import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentClinicId } from '@/lib/clinic-routing'
import { z } from 'zod'

const offerStatusSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  order: z.number().int().min(0),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get('clinic');
    
    if (!clinicId) {
      return NextResponse.json(
        { success: false, message: 'Klinik ID gerekli' },
        { status: 400 }
      )
    }

    const statuses = await prisma.offerStatus.findMany({
      where: { clinicId },
      orderBy: { order: 'asc' },
    })
    
    return NextResponse.json({ success: true, statuses })
  } catch (error) {
    console.error('Error fetching offer statuses:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get('clinic');
    
    if (!clinicId) {
      return NextResponse.json(
        { success: false, message: 'Klinik ID gerekli' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const validatedData = offerStatusSchema.parse(body)

    // Eğer yeni durum varsayılan olarak işaretleniyorsa, diğerlerini varsayılan olmaktan çıkar
    if (validatedData.isDefault) {
      await prisma.offerStatus.updateMany({
        where: { 
          isDefault: true,
          clinicId 
        },
        data: { isDefault: false }
      })
    }

    const status = await prisma.offerStatus.create({
      data: {
        name: validatedData.name,
        displayName: validatedData.displayName,
        color: validatedData.color,
        order: validatedData.order,
        isDefault: validatedData.isDefault || false,
        isActive: validatedData.isActive !== false, // Default true
        clinicId,
      }
    })

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error('Error creating offer status:', error)
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