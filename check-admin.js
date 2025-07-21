const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@test.com' }
    });
    
    console.log('Admin user:', user);
    
    if (user) {
      console.log('Password field exists:', !!user.password);
      console.log('Password length:', user.password?.length);
      console.log('Password starts with $2b$ (bcrypt):', user.password?.startsWith('$2b$'));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin(); 