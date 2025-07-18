const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const clinic = await prisma.clinic.findFirst({ where: { subdomain: 'test' } });
  if (!clinic) { console.log('Klinik bulunamadı'); process.exit(1); }
  const existing = await prisma.clinicUser.findFirst({ where: { email: 'admin@clinikoop.com', clinicId: clinic.id } });
  if (existing) { console.log('Zaten admin var:', existing.email); process.exit(0); }
  const user = await prisma.clinicUser.create({
    data: {
      email: 'admin@clinikoop.com',
      name: 'Admin User',
      password: '$2a$10$hashedpassword', // bcrypt ile hashlenmiş dummy şifre
      role: 'ADMIN',
      clinicId: clinic.id,
      isActive: true
    }
  });
  console.log('Admin kullanıcı oluşturuldu:', user.email);
  process.exit(0);
})(); 