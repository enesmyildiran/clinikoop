import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { randomBytes } from 'crypto';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.isSuperAdmin) {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }

  const users = await prisma.clinicUser.findMany({
    include: {
      clinic: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.isSuperAdmin) {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }

  const body = await request.json();
  const { name, email, role, clinicId, permissions } = body;

  if (!name || !email || !role || !clinicId) {
    return NextResponse.json({ message: 'Eksik alanlar' }, { status: 400 });
  }

  // Aynı klinikte aynı e-posta ile kullanıcı var mı?
  const existing = await prisma.clinicUser.findFirst({
    where: { email, clinicId },
  });
  if (existing) {
    return NextResponse.json({ message: 'Bu e-posta ile zaten kullanıcı var' }, { status: 409 });
  }

  // Davet tokenı oluştur
  const inviteToken = randomBytes(32).toString('hex');

  // Kullanıcıyı oluştur (şifre yok, ilk girişte belirleyecek)
  const newUser = await prisma.clinicUser.create({
    data: {
      name,
      email,
      role,
      clinicId,
      permissions: role === 'CUSTOM' ? JSON.stringify(permissions) : undefined,
      inviteToken,
      isActive: false, // İlk girişte aktifleşecek
    },
  });

  // SMTP/email entegrasyonu için alan (şimdilik konsola yaz)
  // Canlıya geçişte burası SMTP ile değiştirilecek
  console.log(`Davet linki: https://yourdomain.com/invite/${inviteToken}`);
  // TODO: SMTP/email entegrasyonu için kodu güncelle (bkz: README)

  return NextResponse.json({ message: 'Kullanıcı davet edildi', userId: newUser.id });
} 