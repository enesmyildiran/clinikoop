import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Oturum bulunamadı' },
        { status: 401 }
      )
    }

    // Geliştirme modunda mock session (sadece localhost'ta)
    const isDevelopment = process.env.NODE_ENV === 'development'
    const host = request.headers.get('host') || ''
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
    
    if (isDevelopment && isLocalhost) {
      // Geliştirme modunda süper admin oluştur veya al
      let superAdmin = await prisma.user.findFirst({
        where: { role: 'SUPER_ADMIN' }
      })
      
      if (!superAdmin) {
        // Süper admin yoksa oluştur (password olmadan)
        superAdmin = await prisma.user.create({
          data: {
            email: 'superadmin@clinikoop.com',
            name: 'Süper Admin',
            role: 'SUPER_ADMIN',
          }
        })
      }
      
      if (superAdmin) {
        return NextResponse.json({
          user: superAdmin,
          clinic: null,
          isSuperAdmin: true,
          isDevelopment: true // Frontend'e geliştirme modunda olduğumuzu bildir
        })
      }
    }
    
    // Production modunda veya localhost değilse gerçek auth kontrolü
    // Session'dan gelen kullanıcı bilgilerini kullan
    const user = session.user as any
    
    if (user.isSuperAdmin) {
      // Süper admin ise User tablosundan bilgileri al
      const adminUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      
      if (adminUser) {
        return NextResponse.json({
          user: adminUser,
          clinic: null,
          isSuperAdmin: true,
          isDevelopment: false
        })
      }
    } else {
      // Klinik kullanıcısı ise ClinicUser tablosundan bilgileri al
      const clinicUser = await prisma.clinicUser.findUnique({
        where: { id: user.id },
        include: { clinic: true }
      })
      
      if (clinicUser) {
        const { password: _, ...userWithoutPassword } = clinicUser
        return NextResponse.json({
          user: userWithoutPassword,
          clinic: clinicUser.clinic,
          isSuperAdmin: false,
          isDevelopment: false
        })
      }
    }
    
    return NextResponse.json(
      { message: 'Kullanıcı bulunamadı' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 