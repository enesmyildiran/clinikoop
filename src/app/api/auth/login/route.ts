import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { RateLimitService } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'E-posta ve şifre gerekli' },
        { status: 400 }
      )
    }

    // Rate limiting check
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = await RateLimitService.checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: 'Çok fazla giriş denemesi. Lütfen 15 dakika bekleyin.' },
        { status: 429 }
      );
    }

    // Önce User (süper admin) modelinde ara
    let user = await prisma.user.findUnique({
      where: { email },
    })
    
    let isSuperAdmin = false
    
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: 'Geçersiz e-posta veya şifre' },
          { status: 401 }
        )
      }
      isSuperAdmin = true
    } else {
      // Sonra ClinicUser (klinik kullanıcıları) modelinde ara
      const clinicUser = await prisma.clinicUser.findFirst({
        where: { email },
      })
      
      if (!clinicUser) {
        return NextResponse.json(
          { message: 'Geçersiz e-posta veya şifre' },
          { status: 401 }
        )
      }
      
      const isPasswordValid = await bcrypt.compare(password, clinicUser.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: 'Geçersiz e-posta veya şifre' },
          { status: 401 }
        )
      }
      
      user = clinicUser
      isSuperAdmin = false
    }

    // In a real app, you would create a session here
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Giriş başarılı',
      user: userWithoutPassword,
      isSuperAdmin,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 