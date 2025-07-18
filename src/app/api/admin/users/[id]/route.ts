import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.isSuperAdmin) {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }
  const { id } = params;
  const user = await prisma.clinicUser.findUnique({
    where: { id },
    include: { clinic: { select: { id: true, name: true } } },
  });
  if (!user) {
    return NextResponse.json({ message: 'Kullanıcı bulunamadı' }, { status: 404 });
  }
  return NextResponse.json({ user });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.isSuperAdmin) {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }
  const { id } = params;
  const body = await request.json();
  const { name, email, role, clinicId, permissions, isActive } = body;
  const updated = await prisma.clinicUser.update({
    where: { id },
    data: {
      name,
      email,
      role,
      clinicId,
      permissions: role === 'CUSTOM' ? JSON.stringify(permissions) : undefined,
      isActive,
    },
  });
  return NextResponse.json({ user: updated });
} 