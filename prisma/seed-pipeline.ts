const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Eski verileri sil (ilişkili verilerden başlayarak)
  await prisma.treatment.deleteMany();
  await prisma.note.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.patient.deleteMany();

  // Statüleri al
  const statuses = await prisma.offerStatus.findMany();
  const statusCount = statuses.length;
  if (statusCount === 0) throw new Error('Hiç teklif statüsü yok!');

  // Admin user oluştur (varsa atla)
  let user = await prisma.user.findFirst({ where: { email: 'admin@clinikoop.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'admin@clinikoop.com',
        name: 'Admin User',
        role: 'ADMIN',
        password: 'hashedpassword',
      },
    });
  }

  // 5 hasta ekle
  for (let i = 1; i <= 5; i++) {
    const patient = await prisma.patient.create({
      data: {
        name: `Test Hasta ${i}`,
        email: `hasta${i}@mail.com`,
        phone: `55500000${i}`,
        birthDate: new Date(1990 + i, i, i),
        address: `Adres ${i}`,
        notes: `Notlar ${i}`,
        instagram: `@hasta${i}`,
        facebook: `fb.com/hasta${i}`,
        whatsapp: `55500000${i}`,
        medicalHistory: `Geçmiş ${i}`,
        allergies: i % 2 === 0 ? 'Yok' : 'Penisilin',
      }
    });

    // Her hastaya 3 teklif ekle
    for (let j = 1; j <= 3; j++) {
      const status = statuses[(i + j) % statusCount];
      const offer = await prisma.offer.create({
        data: {
          slug: `offer-${i}-${j}-${Date.now()}`,
          title: `Test Teklif ${i}-${j}`,
          description: `Tedavi açıklaması ${i}-${j}`,
          totalPrice: 10000 + i * 1000 + j * 500,
          currency: j % 2 === 0 ? 'USD' : 'TRY',
          statusId: status.id,
          patientId: patient.id,
          userId: user.id,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(2024, j + i, 1),
        },
      });
      // Tedavileri ekle
      await prisma.treatment.create({
        data: {
          name: `Tedavi ${i}-${j}`,
          price: 2000 + i * 100 + j * 50,
          quantity: 1 + (i + j) % 2,
          offerId: offer.id,
        },
      });
    }
  }
  console.log('Dummy veriler başarıyla eklendi!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect()); 