import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }
  // Süper admin mi yoksa klinik kullanıcısı mı?
  const userId = (session.user as any).id;
  const isSuperAdmin = (session.user as any).isSuperAdmin;
  let user;
  if (isSuperAdmin) {
    user = await prisma.user.findUnique({ where: { id: userId } });
  } else {
    user = await prisma.clinicUser.findUnique({
      where: { id: userId },
      include: { clinic: { select: { id: true, name: true } } },
    });
  }
  if (!user) {
    return NextResponse.json({ message: 'Kullanıcı bulunamadı' }, { status: 404 });
  }
  return NextResponse.json({ user });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }
  const userId = (session.user as any).id;
  const isSuperAdmin = (session.user as any).isSuperAdmin;
  const body = await request.json();
  const { name, email, password } = body;
  let updated;
  if (isSuperAdmin) {
    updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
      },
    });
  } else {
    updated = await prisma.clinicUser.update({
      where: { id: userId },
      data: {
        name,
        email,
        ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
      },
    });
  }
  return NextResponse.json({ user: updated });
} 