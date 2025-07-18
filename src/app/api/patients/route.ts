import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getClinicIdFromRequest } from '@/lib/clinic-routing';
import { patientsCreated } from '@/lib/metrics';
import { z } from 'zod';

const patientSchema = z.object({
  name: z.string().min(2),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  insurance: z.string().optional(),
  insuranceNumber: z.string().optional(),
  isActive: z.boolean().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(8),
  phoneCountry: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  nationality: z.string().optional(),
  notes: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  referralSourceId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(req);
    
    const id = req.nextUrl.searchParams.get('id');
    if (id) {
      const whereClause: any = { id, isDeleted: false };
      if (clinicId) {
        whereClause.clinicId = clinicId;
      }
      
      const patient = await prisma.patient.findUnique({
        where: whereClause,
      });
      return NextResponse.json({ patient });
    }
    
    const whereClause: any = { isDeleted: false };
    if (clinicId) {
      whereClause.clinicId = clinicId;
    }
    
    const patients = await prisma.patient.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(req);
    if (!clinicId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Klinik bilgisi bulunamadı.' 
      }, { status: 400 });
    }
    
    const body = await req.json();
    console.log('API/POST /patients - Gelen veri:', body);
    const parsed = patientSchema.safeParse(body);
    console.log('API/POST /patients - Parse sonucu:', parsed);
    if (!parsed.success) {
      console.log('API/POST /patients - Zod validation hatası:', parsed.error);
      return NextResponse.json({ error: 'Geçersiz veri', details: parsed.error.errors }, { status: 400 });
    }
    // Benzersiz telefon/email kontrolü (aynı klinik içinde)
    const existing = await prisma.patient.findFirst({
      where: {
        OR: [
          { phone: parsed.data.phone },
          { email: parsed.data.email || undefined },
        ],
        clinicId: clinicId,
        isDeleted: false,
      },
    });
    if (existing) {
      console.log('API/POST /patients - Benzersiz kontrolü: zaten var');
      return NextResponse.json({ error: 'Bu telefon veya e-posta ile kayıtlı hasta var.' }, { status: 409 });
    }
    // Doğum tarihini Date'e çevir
    const data = { ...parsed.data };
    if (data.birthDate) {
      try {
        const dateObj = new Date(data.birthDate);
        if (!isNaN(dateObj.getTime())) {
          data.birthDate = dateObj as any;
        } else {
          data.birthDate = undefined;
        }
      } catch {
        data.birthDate = undefined;
      }
    } else {
      data.birthDate = undefined;
    }
    
    // Kullanıcı oluştur veya mevcut kullanıcıyı bul
    let user = await prisma.clinicUser.findFirst({
      where: {
        email: 'admin@clinikoop.com',
        clinicId: clinicId,
      },
    });

    if (!user) {
      user = await prisma.clinicUser.create({
        data: {
          email: 'admin@clinikoop.com',
          name: 'Admin User',
          role: 'ADMIN',
          password: 'hashedpassword',
          clinicId: clinicId,
        },
      });
    }

    // ClinicId ve createdById'yi ekle
    const patientData = { ...data, clinicId, createdById: user.id };
    
    // Yeni alanlar doğrudan data objesinde mevcut, Prisma create ve update ile kaydedilecek
    const patient = await prisma.patient.create({ data: patientData });

    // Metrikleri kaydet
    patientsCreated.inc({ clinic_id: clinicId });
    console.log('API/POST /patients - Kayıt başarılı:', patient);
    return NextResponse.json({ patient });
  } catch (e) {
    console.error('API/POST /patients - Sunucu hatası:', e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(req);
    if (!clinicId) {
      return NextResponse.json({ error: 'Klinik bilgisi bulunamadı' }, { status: 400 });
    }
    
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id parametresi gerekli' }, { status: 400 });
    }
    const patient = await prisma.patient.updateMany({
      where: { 
        id, 
        clinicId: clinicId,
        isDeleted: false 
      },
      data: { isDeleted: true },
    });
    if (patient.count === 0) {
      return NextResponse.json({ error: 'Hasta bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // ClinicId'yi al
    const clinicId = await getClinicIdFromRequest(req);
    if (!clinicId) {
      return NextResponse.json({ error: 'Klinik bilgisi bulunamadı' }, { status: 400 });
    }
    
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id parametresi gerekli' }, { status: 400 });
    }

    const body = await req.json();
    console.log('API/PUT /patients - Gelen veri:', body);
    // Partial update için şemayı partial yap
    const parsed = patientSchema.partial().safeParse(body);
    console.log('API/PUT /patients - Parse sonucu:', parsed);
    if (!parsed.success) {
      console.log('API/PUT /patients - Zod validation hatası:', parsed.error);
      return NextResponse.json({ error: 'Geçersiz veri', details: parsed.error.errors }, { status: 400 });
    }

    // Mevcut hastayı çek (aynı klinik içinde)
    const existingPatient = await prisma.patient.findUnique({ 
      where: { 
        id, 
        clinicId: clinicId,
        isDeleted: false 
      } 
    });
    if (!existingPatient) {
      return NextResponse.json({ error: 'Hasta bulunamadı' }, { status: 404 });
    }

    // referralSourceId kontrolü
    if (parsed.data.referralSourceId) {
      const referralSource = await prisma.referralSource.findUnique({
        where: { id: parsed.data.referralSourceId }
      });
      if (!referralSource) {
        return NextResponse.json({ error: 'Geçersiz referans kaynağı' }, { status: 400 });
      }
    }

    // Güncellenecek alanları hazırla
    const data = { ...parsed.data };
    // Doğum tarihini Date'e çevir
    if (data.birthDate) {
      try {
        const dateObj = new Date(data.birthDate);
        if (!isNaN(dateObj.getTime())) {
          data.birthDate = dateObj as any;
        } else {
          data.birthDate = undefined;
        }
      } catch {
        data.birthDate = undefined;
      }
    }

    // Güncellemeden sonra zorunlu alanlar boş mu kontrol et
    const newName = data.name !== undefined ? data.name : existingPatient.name;
    const newPhone = data.phone !== undefined ? data.phone : existingPatient.phone;
    if (!newName || newName.length < 2) {
      return NextResponse.json({ error: 'Ad alanı zorunludur ve en az 2 karakter olmalıdır.' }, { status: 400 });
    }
    if (!newPhone || newPhone.length < 8) {
      return NextResponse.json({ error: 'Telefon alanı zorunludur ve en az 8 karakter olmalıdır.' }, { status: 400 });
    }

    const patient = await prisma.patient.update({
      where: { 
        id, 
        clinicId: clinicId,
        isDeleted: false 
      },
      data: data,
    });
    console.log('API/PUT /patients - Güncelleme başarılı:', patient);
    return NextResponse.json({ patient });
  } catch (e) {
    console.error('API/PUT /patients - Sunucu hatası:', e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 