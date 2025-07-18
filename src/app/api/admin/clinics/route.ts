import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Yeni klinik için varsayılan veriler oluştur
async function createDefaultDataForClinic(clinicId: string) {
  try {
    // 1. Varsayılan teklif durumları oluştur
    const defaultOfferStatuses = [
      { name: 'draft', displayName: 'Taslak', color: '#6B7280', order: 0, isDefault: true },
      { name: 'sent', displayName: 'Gönderildi', color: '#3B82F6', order: 1 },
      { name: 'viewed', displayName: 'Görüntülendi', color: '#10B981', order: 2 },
      { name: 'accepted', displayName: 'Kabul Edildi', color: '#059669', order: 3 },
      { name: 'rejected', displayName: 'Reddedildi', color: '#DC2626', order: 4 },
      { name: 'expired', displayName: 'Süresi Doldu', color: '#F59E0B', order: 5 },
    ];

    for (const status of defaultOfferStatuses) {
      await prisma.offerStatus.create({
        data: {
          ...status,
          clinicId: clinicId,
        },
      });
    }

    // 2. Varsayılan PDF şablonu oluştur
    const defaultPdfTemplate = {
      name: 'Varsayılan Şablon',
      description: 'Yeni klinik için varsayılan PDF şablonu',
      content: JSON.stringify({
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Teklif</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .patient-info { margin-bottom: 20px; }
              .treatments { margin-bottom: 20px; }
              .total { font-weight: bold; font-size: 18px; text-align: right; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>{{clinicName}}</h1>
              <p>Teklif</p>
            </div>
            
            <div class="patient-info">
              <h3>Hasta Bilgileri</h3>
              <p><strong>Ad:</strong> {{patientName}}</p>
              <p><strong>Telefon:</strong> {{patientPhone}}</p>
              <p><strong>Tarih:</strong> {{offerDate}}</p>
            </div>
            
            <div class="treatments">
              <h3>Tedavi Planı</h3>
              <table>
                <thead>
                  <tr>
                    <th>Tedavi</th>
                    <th>Açıklama</th>
                    <th>Fiyat</th>
                  </tr>
                </thead>
                <tbody>
                  {{#each treatments}}
                  <tr>
                    <td>{{name}}</td>
                    <td>{{description}}</td>
                    <td>{{price}} {{../currency}}</td>
                  </tr>
                  {{/each}}
                </tbody>
              </table>
            </div>
            
            <div class="total">
              <p>Toplam: {{totalPrice}} {{currency}}</p>
            </div>
          </body>
          </html>
        `,
        css: `
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .patient-info { margin-bottom: 20px; }
          .treatments { margin-bottom: 20px; }
          .total { font-weight: bold; font-size: 18px; text-align: right; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        `
      }),
      isDefault: true,
    };

    await prisma.pdfTemplate.create({
      data: defaultPdfTemplate,
    });

    // 3. Varsayılan referans kaynakları oluştur
    const defaultReferralSources = [
      { name: 'Google', displayName: 'Google', description: 'Google arama sonuçları' },
      { name: 'Sosyal Medya', displayName: 'Sosyal Medya', description: 'Instagram, Facebook, Twitter' },
      { name: 'Arkadaş Tavsiyesi', displayName: 'Arkadaş Tavsiyesi', description: 'Mevcut hasta tavsiyesi' },
      { name: 'Yol Levhası', displayName: 'Yol Levhası', description: 'Yol kenarı levhalar' },
      { name: 'Diğer', displayName: 'Diğer', description: 'Diğer kaynaklar' },
    ];

    for (const source of defaultReferralSources) {
      await prisma.referralSource.create({
        data: source,
      });
    }

    // 4. Varsayılan klinik ayarları oluştur
    const defaultSettings = [
      { key: 'default_currency', value: 'TRY' },
      { key: 'default_language', value: 'tr' },
      { key: 'offer_validity_days', value: '30' },
      { key: 'reminder_days_before', value: '3' },
      { key: 'clinic_logo_url', value: '' },
      { key: 'clinic_address', value: '' },
      { key: 'clinic_phone', value: '' },
      { key: 'clinic_email', value: '' },
    ];

    for (const setting of defaultSettings) {
      await prisma.clinicSetting.create({
        data: {
          ...setting,
          clinicId: clinicId,
        },
      });
    }

    console.log(`Klinik ${clinicId} için varsayılan veriler oluşturuldu`);
  } catch (error) {
    console.error(`Klinik ${clinicId} için varsayılan veriler oluşturulurken hata:`, error);
    throw error;
  }
}

// GET: Tüm klinikleri listele
export async function GET() {
  try {
    const clinics = await prisma.clinic.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true,
          },
        },
        _count: {
          select: {
            patients: true,
            offers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(clinics);
  } catch (error) {
    console.error('Klinikler listelenirken hata:', error);
    return NextResponse.json(
      { error: 'Klinikler listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST: Yeni klinik oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subdomain, domain, maxUsers, maxPatients, maxOffers, isActive } = body;

    // Validasyon
    if (!name || !subdomain) {
      return NextResponse.json(
        { message: 'Klinik adı ve subdomain zorunludur' },
        { status: 400 }
      );
    }

    // Subdomain formatını kontrol et
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json(
        { message: 'Subdomain sadece küçük harf, rakam ve tire içerebilir' },
        { status: 400 }
      );
    }

    // Subdomain uzunluğunu kontrol et
    if (subdomain.length < 3 || subdomain.length > 50) {
      return NextResponse.json(
        { message: 'Subdomain 3-50 karakter arasında olmalıdır' },
        { status: 400 }
      );
    }

    // Subdomain benzersizliğini kontrol et
    const existingClinic = await prisma.clinic.findUnique({
      where: { subdomain },
    });

    if (existingClinic) {
      return NextResponse.json(
        { message: 'Bu subdomain zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Domain formatını kontrol et (eğer varsa)
    if (domain) {
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(domain)) {
        return NextResponse.json(
          { message: 'Geçersiz domain formatı' },
          { status: 400 }
        );
      }
    }

    // Limitleri kontrol et
    if (maxUsers < 1 || maxUsers > 100) {
      return NextResponse.json(
        { message: 'Maksimum kullanıcı sayısı 1-100 arasında olmalıdır' },
        { status: 400 }
      );
    }

    if (maxPatients < 1 || maxPatients > 10000) {
      return NextResponse.json(
        { message: 'Maksimum hasta sayısı 1-10000 arasında olmalıdır' },
        { status: 400 }
      );
    }

    if (maxOffers < 1 || maxOffers > 10000) {
      return NextResponse.json(
        { message: 'Maksimum teklif sayısı 1-10000 arasında olmalıdır' },
        { status: 400 }
      );
    }

    // Klinik oluştur
    const clinic = await prisma.clinic.create({
      data: {
        name,
        subdomain,
        domain: domain || null,
        maxUsers,
        maxPatients,
        maxOffers,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    // Yeni klinik için varsayılan veriler oluştur
    await createDefaultDataForClinic(clinic.id);

    return NextResponse.json(clinic, { status: 201 });
  } catch (error) {
    console.error('Klinik oluşturulurken hata:', error);
    return NextResponse.json(
      { message: 'Klinik oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 