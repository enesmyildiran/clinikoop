// scripts/list-clinic-users.js
// Tüm klinik kullanıcılarının e-posta ve isimlerini listeler

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.clinicUser.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      clinicId: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  if (users.length === 0) {
    console.log('Hiç klinik kullanıcısı bulunamadı.');
    return;
  }

  console.log('Klinik Kullanıcıları:');
  users.forEach((user, i) => {
    console.log(`${i + 1}. ${user.name} | ${user.email} | Rol: ${user.role} | Aktif: ${user.isActive} | KlinikID: ${user.clinicId}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 