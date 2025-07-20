#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createProductionUsers() {
  console.log('🚀 Production kullanıcıları oluşturuluyor...');
  
  try {
    // Önce mevcut kullanıcıları kontrol et
    const existingUsers = await prisma.user.findMany();
    const existingClinicUsers = await prisma.clinicUser.findMany();
    
    console.log(`📊 Mevcut kullanıcılar: ${existingUsers.length} User, ${existingClinicUsers.length} ClinicUser`);
    
    // Test kliniği oluştur
    let testClinic = await prisma.clinic.findFirst({
      where: { subdomain: 'test1' }
    });
    
    if (!testClinic) {
      console.log('🏥 Test kliniği oluşturuluyor...');
      testClinic = await prisma.clinic.create({
        data: {
          name: 'Test Klinik',
          subdomain: 'test1',
          domain: 'test1.clinikoop.vercel.app',
          isActive: true,
          maxUsers: 10,
          maxPatients: 1000,
          maxOffers: 5000,
          subscriptionStatus: 'ACTIVE'
        }
      });
      console.log('✅ Test kliniği oluşturuldu:', testClinic.id);
    } else {
      console.log('✅ Test kliniği zaten mevcut:', testClinic.id);
    }
    
    // Super Admin kullanıcısı oluştur
    let superAdmin = await prisma.user.findFirst({
      where: { email: 'admin@test.com' }
    });
    
    if (!superAdmin) {
      console.log('👑 Super Admin oluşturuluyor...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      superAdmin = await prisma.user.create({
        data: {
          email: 'admin@test.com',
          name: 'Super Admin',
          role: 'SUPER_ADMIN',
          password: hashedPassword
        }
      });
      console.log('✅ Super Admin oluşturuldu:', superAdmin.id);
    } else {
      console.log('✅ Super Admin zaten mevcut:', superAdmin.id);
    }
    
    // Clinic Admin kullanıcısı oluştur
    let clinicAdmin = await prisma.clinicUser.findFirst({
      where: { email: 'clinic@test.com' }
    });
    
    if (!clinicAdmin) {
      console.log('🏥 Clinic Admin oluşturuluyor...');
      const hashedPassword = await bcrypt.hash('clinic123', 10);
      clinicAdmin = await prisma.clinicUser.create({
        data: {
          email: 'clinic@test.com',
          name: 'Clinic Admin',
          role: 'ADMIN',
          password: hashedPassword,
          clinicId: testClinic.id,
          isActive: true
        }
      });
      console.log('✅ Clinic Admin oluşturuldu:', clinicAdmin.id);
    } else {
      console.log('✅ Clinic Admin zaten mevcut:', clinicAdmin.id);
    }
    
    // Test hastası oluştur
    let testPatient = await prisma.patient.findFirst({
      where: { 
        email: 'hasta@test.com',
        clinicId: testClinic.id
      }
    });
    
    if (!testPatient) {
      console.log('👤 Test hastası oluşturuluyor...');
      testPatient = await prisma.patient.create({
        data: {
          name: 'Test Hasta',
          email: 'hasta@test.com',
          phone: '+905551234567',
          clinicId: testClinic.id,
          createdById: clinicAdmin.id
        }
      });
      console.log('✅ Test hastası oluşturuldu:', testPatient.id);
    } else {
      console.log('✅ Test hastası zaten mevcut:', testPatient.id);
    }
    
    // Test teklifi oluştur
    let testOffer = await prisma.offer.findFirst({
      where: { 
        title: 'Test Tedavi Teklifi',
        clinicId: testClinic.id
      }
    });
    
    if (!testOffer) {
      console.log('📋 Test teklifi oluşturuluyor...');
      testOffer = await prisma.offer.create({
        data: {
          title: 'Test Tedavi Teklifi',
          description: 'Bu bir test teklifidir',
          totalPrice: 5000,
          currency: 'TRY',
          slug: 'test-tedavi-teklifi',
          clinicId: testClinic.id,
          createdById: clinicAdmin.id
        }
      });
      console.log('✅ Test teklifi oluşturuldu:', testOffer.id);
    } else {
      console.log('✅ Test teklifi zaten mevcut:', testOffer.id);
    }
    
    console.log('\n🎉 Tüm test verileri başarıyla oluşturuldu!');
    console.log('\n📋 Giriş Bilgileri:');
    console.log('👑 Super Admin: admin@test.com / admin123');
    console.log('🏥 Clinic Admin: clinic@test.com / clinic123');
    console.log('🏥 Test Klinik: test1.clinikoop.vercel.app');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createProductionUsers(); 