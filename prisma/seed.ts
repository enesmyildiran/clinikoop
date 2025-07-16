const { PrismaClient } = require('@prisma/client');
const { TEMPLATE_LIBRARY } = require('../src/lib/template-library.js');

const prisma = new PrismaClient();

async function main() {
  // PDF şablonlarını ekle
  for (const tpl of TEMPLATE_LIBRARY) {
    // Aynı isimde şablon var mı kontrol et
    const exists = await prisma.pdfTemplate.findFirst({ where: { name: tpl.name } });
    if (!exists) {
      await prisma.pdfTemplate.create({
        data: {
          name: tpl.name,
          description: tpl.description || '',
          category: tpl.category,
          version: tpl.version,
          author: tpl.author || 'Clinikoop',
          content: JSON.stringify(tpl),
          isDefault: tpl.isDefault ?? false,
          isFixed: tpl.isFixed ?? false,
          isPublic: tpl.isPublic ?? true,
          tags: JSON.stringify(tpl.tags ?? []),
          metadata: JSON.stringify(tpl.metadata ?? {}),
          settings: JSON.stringify(tpl.settings ?? {}),
        }
      });
      console.log(`Şablon eklendi: ${tpl.name}`);
    } else {
      console.log(`Zaten var: ${tpl.name}`);
    }
  }

  // Mevcut teklifleri rastgele durumlara dağıt
  console.log('\n--- Teklif Durumları Dağıtılıyor ---');
  
  // Tüm durumları al
  const statuses = await prisma.offerStatus.findMany({
    orderBy: { order: 'asc' }
  });

  if (statuses.length === 0) {
    console.log('Hiç durum bulunamadı!');
    return;
  }

  console.log(`Bulunan durumlar: ${statuses.map((s: any) => s.displayName).join(', ')}`);

  // Tüm teklifleri al
  const offers = await prisma.offer.findMany({
    where: { isDeleted: false }
  });

  console.log(`Toplam ${offers.length} teklif bulundu`);

  // En az bir teklifin durumu 'accepted' (veya 'Kabul Edildi') olsun
  const acceptedStatus = statuses.find((s: any) => s.name === 'accepted' || s.displayName === 'Kabul Edildi');
  if (offers.length > 0 && acceptedStatus) {
    await prisma.offer.update({
      where: { id: offers[0].id },
      data: { statusId: acceptedStatus.id }
    });
    console.log(`İlk teklif '${offers[0].title}' -> ${acceptedStatus.displayName}`);
  }

  // Diğer teklifleri rastgele durumlara ata
  for (let i = 1; i < offers.length; i++) {
    const offer = offers[i];
    // Rastgele bir durum seç (varsayılan durum hariç, daha az olsun)
    const randomIndex = Math.floor(Math.random() * statuses.length);
    const randomStatus = statuses[randomIndex];

    // Varsayılan durum (Taslak) daha az olsun
    const isDefaultStatus = randomStatus.isDefault;
    const shouldUseDefault = Math.random() < 0.2; // %20 ihtimal

    let selectedStatus = randomStatus;
    if (isDefaultStatus && !shouldUseDefault) {
      // Varsayılan değilse, diğer durumlardan birini seç
      const nonDefaultStatuses = statuses.filter((s: any) => !s.isDefault);
      if (nonDefaultStatuses.length > 0) {
        selectedStatus = nonDefaultStatuses[Math.floor(Math.random() * nonDefaultStatuses.length)];
      }
    }

    // Teklifi güncelle
    await prisma.offer.update({
      where: { id: offer.id },
      data: { statusId: selectedStatus.id }
    });

    console.log(`Teklif "${offer.title}" -> ${selectedStatus.displayName}`);
  }

  // Durum dağılımını göster
  console.log('\n--- Durum Dağılımı ---');
  for (const status of statuses) {
    const count = await prisma.offer.count({
      where: { 
        statusId: status.id,
        isDeleted: false
      }
    });
    console.log(`${status.displayName}: ${count} teklif`);
  }

  console.log('\n✅ Teklif durumları başarıyla dağıtıldı!');
}

main()
  .catch((e: any) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect()); 