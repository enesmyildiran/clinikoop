import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Geliştirme modunda mock session (sadece localhost'ta)
    const isDevelopment = process.env.NODE_ENV === 'development'
    const host = request.headers.get('host') || ''
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
    
    if (isDevelopment && isLocalhost) {
      // Geliştirme modunda süper admin olarak kabul et
      const superAdmin = await prisma.user.findFirst({
        where: { role: 'SUPER_ADMIN' }
      })
      
      if (superAdmin) {
        const { password: _, ...userWithoutPassword } = superAdmin
        return NextResponse.json({
          user: userWithoutPassword,
          clinic: null,
          isSuperAdmin: true,
          isDevelopment: true // Frontend'e geliştirme modunda olduğumuzu bildir
        })
      }
      
      // Süper admin yoksa ilk kullanıcıyı al
      const firstUser = await prisma.user.findFirst()
      if (firstUser) {
        const { password: _, ...userWithoutPassword } = firstUser
        return NextResponse.json({
          user: userWithoutPassword,
          clinic: null,
          isSuperAdmin: true,
          isDevelopment: true
        })
      }
    }
    
    // Production modunda veya localhost değilse gerçek auth kontrolü
    // Bu kısım canlıya alındığında NextAuth session kontrolü yapacak
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