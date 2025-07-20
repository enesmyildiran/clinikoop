import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

// GET - Kategorileri listele
export async function GET() {
  try {
    // Session kontrolünü geçici olarak kaldır
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    // }

    const categories = await prisma.supportCategory.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    // Eğer hiç kategori yoksa, default kategoriler oluştur
    if (categories.length === 0) {
      const defaultCategories = [
        { name: 'Teknik Sorun', displayName: 'Teknik Sorun', description: 'Sistem ve teknik sorunlar', order: 1 },
        { name: 'Kullanım', displayName: 'Kullanım', description: 'Kullanım ile ilgili sorular', order: 2 },
        { name: 'Ödeme', displayName: 'Ödeme', description: 'Ödeme ve faturalama sorunları', order: 3 },
        { name: 'Diğer', displayName: 'Diğer', description: 'Diğer konular', order: 4 }
      ];

      await prisma.supportCategory.createMany({
        data: defaultCategories
      });

      const newCategories = await prisma.supportCategory.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });

      return NextResponse.json({ 
        success: true, 
        categories: newCategories 
      });
    }

    return NextResponse.json({ 
      success: true, 
      categories 
    });
  } catch (error) {
    console.error('Kategoriler listelenirken hata:', error);
    return NextResponse.json(
      { error: 'Kategoriler listelenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Yeni kategori oluştur
export async function POST(request: NextRequest) {
  try {
    // Session kontrolünü geçici olarak kaldır
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    // }

    const body = await request.json();
    const { name, color, description, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Kategori adı gereklidir' },
        { status: 400 }
      );
    }

    const category = await prisma.supportCategory.create({
      data: {
        name,
        displayName: name,
        description: description || '',
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ 
      success: true, 
      category 
    });
  } catch (error) {
    console.error('Kategori oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Kategori oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
} 