#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Vercel Migration Script Başlatılıyor...');

try {
  // Prisma client generate
  console.log('📦 Prisma Client generating...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Database migration
  console.log('🗄️ Database migration running...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  
  // Seed data (optional)
  console.log('🌱 Seed data loading...');
  try {
    execSync('npx prisma db seed', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Seed data loading failed, continuing...');
  }
  
  console.log('✅ Migration completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
} 