/*
  Warnings:

  - Added the required column `clinicId` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "clinics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "domain" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxUsers" INTEGER NOT NULL DEFAULT 5,
    "maxPatients" INTEGER NOT NULL DEFAULT 100,
    "maxOffers" INTEGER NOT NULL DEFAULT 500,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "clinic_packages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "clinic_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "clinic_users_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "clinic_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "clinic_settings_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ClinicToClinicPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ClinicToClinicPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "clinics" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClinicToClinicPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "clinic_packages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Varsayılan klinik oluştur
INSERT INTO "clinics" ("id", "name", "subdomain", "isActive", "maxUsers", "maxPatients", "maxOffers", "createdAt", "updatedAt") 
VALUES ('default_clinic', 'Varsayılan Klinik', 'default', true, 10, 1000, 5000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Varsayılan kullanıcı oluştur (mevcut kullanıcıları kopyala)
INSERT INTO "clinic_users" ("id", "email", "name", "role", "password", "isActive", "clinicId", "createdAt", "updatedAt")
SELECT "id", "email", "name", "role", "password", true, 'default_clinic', "createdAt", "updatedAt" FROM "users";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "appointmentType" TEXT NOT NULL DEFAULT 'MUAYENE',
    "status" TEXT NOT NULL DEFAULT 'BEKLEMEDE',
    "notes" TEXT,
    "isBlockage" BOOLEAN NOT NULL DEFAULT false,
    "relatedOfferId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "appointments_relatedOfferId_fkey" FOREIGN KEY ("relatedOfferId") REFERENCES "offers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_appointments" ("appointmentType", "createdAt", "doctorId", "durationMinutes", "endTime", "id", "isBlockage", "notes", "patientId", "relatedOfferId", "startTime", "status", "updatedAt") SELECT "appointmentType", "createdAt", "doctorId", "durationMinutes", "endTime", "id", "isBlockage", "notes", "patientId", "relatedOfferId", "startTime", "status", "updatedAt" FROM "appointments";
DROP TABLE "appointments";
ALTER TABLE "new_appointments" RENAME TO "appointments";
CREATE TABLE "new_doctor_schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctorId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "breakStartTime" TEXT,
    "breakEndTime" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "doctor_schedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_doctor_schedules" ("breakEndTime", "breakStartTime", "createdAt", "dayOfWeek", "doctorId", "endTime", "id", "startTime", "updatedAt") SELECT "breakEndTime", "breakStartTime", "createdAt", "dayOfWeek", "doctorId", "endTime", "id", "startTime", "updatedAt" FROM "doctor_schedules";
DROP TABLE "doctor_schedules";
ALTER TABLE "new_doctor_schedules" RENAME TO "doctor_schedules";
CREATE TABLE "new_doctor_time_offs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctorId" TEXT NOT NULL,
    "startDateTime" DATETIME NOT NULL,
    "endDateTime" DATETIME NOT NULL,
    "reason" TEXT NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "doctor_time_offs_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_doctor_time_offs" ("createdAt", "doctorId", "endDateTime", "id", "isRecurring", "reason", "startDateTime", "updatedAt") SELECT "createdAt", "doctorId", "endDateTime", "id", "isRecurring", "reason", "startDateTime", "updatedAt" FROM "doctor_time_offs";
DROP TABLE "doctor_time_offs";
ALTER TABLE "new_doctor_time_offs" RENAME TO "doctor_time_offs";
CREATE TABLE "new_notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "offerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "notes_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_notes" ("content", "createdAt", "id", "isPrivate", "offerId", "updatedAt", "userId") SELECT "content", "createdAt", "id", "isPrivate", "offerId", "updatedAt", "userId" FROM "notes";
DROP TABLE "notes";
ALTER TABLE "new_notes" RENAME TO "notes";
CREATE TABLE "new_offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalPrice" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "statusId" TEXT NOT NULL,
    "validUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "estimatedDays" INTEGER NOT NULL DEFAULT 0,
    "estimatedHours" INTEGER NOT NULL DEFAULT 0,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "offers_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "offer_statuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_offers" ("createdAt", "currency", "description", "estimatedDays", "estimatedHours", "id", "isDeleted", "patientId", "slug", "statusId", "title", "totalPrice", "updatedAt", "userId", "validUntil", "clinicId") SELECT "createdAt", "currency", "description", "estimatedDays", "estimatedHours", "id", "isDeleted", "patientId", "slug", "statusId", "title", "totalPrice", "updatedAt", "userId", "validUntil", 'default_clinic' FROM "offers";
DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
CREATE UNIQUE INDEX "offers_slug_key" ON "offers"("slug");
CREATE TABLE "new_patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "gender" TEXT,
    "city" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "insurance" TEXT,
    "insuranceNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "birthDate" DATETIME,
    "address" TEXT,
    "notes" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "whatsapp" TEXT,
    "medicalHistory" TEXT,
    "allergies" TEXT,
    "salesRepId" TEXT,
    "referralSourceId" TEXT,
    "country" TEXT,
    "phoneCountry" TEXT,
    "nationality" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "patients_referralSourceId_fkey" FOREIGN KEY ("referralSourceId") REFERENCES "referral_sources" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "patients_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_patients" ("address", "allergies", "birthDate", "city", "country", "createdAt", "email", "emergencyContact", "emergencyPhone", "facebook", "firstName", "gender", "id", "instagram", "insurance", "insuranceNumber", "isActive", "isDeleted", "lastName", "medicalHistory", "name", "nationality", "notes", "phone", "phoneCountry", "referralSourceId", "salesRepId", "updatedAt", "whatsapp", "clinicId") SELECT "address", "allergies", "birthDate", "city", "country", "createdAt", "email", "emergencyContact", "emergencyPhone", "facebook", "firstName", "gender", "id", "instagram", "insurance", "insuranceNumber", "isActive", "isDeleted", "lastName", "medicalHistory", "name", "nationality", "notes", "phone", "phoneCountry", "referralSourceId", "salesRepId", "updatedAt", "whatsapp", 'default_clinic' FROM "patients";
DROP TABLE "patients";
ALTER TABLE "new_patients" RENAME TO "patients";
CREATE TABLE "new_reminders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "offerId" TEXT,
    "patientId" TEXT,
    CONSTRAINT "reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reminders_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reminders_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_reminders" ("createdAt", "description", "dueDate", "id", "isPinned", "isPrivate", "offerId", "patientId", "priority", "reason", "status", "title", "updatedAt", "userId") SELECT "createdAt", "description", "dueDate", "id", "isPinned", "isPrivate", "offerId", "patientId", "priority", "reason", "status", "title", "updatedAt", "userId" FROM "reminders";
DROP TABLE "reminders";
ALTER TABLE "new_reminders" RENAME TO "reminders";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "id", "name", "password", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "role", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "clinics_subdomain_key" ON "clinics"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "clinic_settings_clinicId_key_key" ON "clinic_settings"("clinicId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "_ClinicToClinicPackage_AB_unique" ON "_ClinicToClinicPackage"("A", "B");

-- CreateIndex
CREATE INDEX "_ClinicToClinicPackage_B_index" ON "_ClinicToClinicPackage"("B");
