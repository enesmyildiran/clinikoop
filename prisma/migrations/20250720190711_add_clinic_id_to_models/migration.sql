/*
  Warnings:

  - You are about to drop the `activity_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `analytics_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinic_packages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_schedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_time_offs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `system_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `template_usages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `template_versions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `packageId` on the `clinics` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDays` on the `offers` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedHours` on the `offers` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `offers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `offers` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyPhone` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `facebook` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `insurance` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceNumber` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `salesRepId` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `pdf_templates` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `pdf_templates` table. All the data in the column will be lost.
  - You are about to drop the column `isFixed` on the `pdf_templates` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `pdf_templates` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `pdf_templates` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `pdf_templates` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `pdf_templates` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `pdf_templates` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDays` on the `treatments` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedHours` on the `treatments` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `clinic_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `offer_statuses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `pdf_templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `referral_sources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `support_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `support_priorities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `support_statuses` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "offer_statuses_name_clinicId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "activity_logs";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "analytics_events";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "appointments";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "clinic_packages";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "doctor_schedules";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "doctor_time_offs";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "support_attachments";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "system_logs";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "template_usages";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "template_versions";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "patient_offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "assigned" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "patient_offers_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "patient_offers_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clinic_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "clinic_settings_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_clinic_settings" ("clinicId", "createdAt", "id", "key", "updatedAt", "value") SELECT "clinicId", "createdAt", "id", "key", "updatedAt", "value" FROM "clinic_settings";
DROP TABLE "clinic_settings";
ALTER TABLE "new_clinic_settings" RENAME TO "clinic_settings";
CREATE UNIQUE INDEX "clinic_settings_clinicId_key_key" ON "clinic_settings"("clinicId", "key");
CREATE TABLE "new_clinics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "domain" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxUsers" INTEGER NOT NULL DEFAULT 10,
    "maxPatients" INTEGER NOT NULL DEFAULT 1000,
    "maxOffers" INTEGER NOT NULL DEFAULT 5000,
    "subscriptionStartDate" DATETIME,
    "subscriptionEndDate" DATETIME,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'TRIAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_clinics" ("createdAt", "domain", "id", "isActive", "maxOffers", "maxPatients", "maxUsers", "name", "subdomain", "subscriptionEndDate", "subscriptionStartDate", "subscriptionStatus", "updatedAt") SELECT "createdAt", "domain", "id", "isActive", "maxOffers", "maxPatients", "maxUsers", "name", "subdomain", "subscriptionEndDate", "subscriptionStartDate", "subscriptionStatus", "updatedAt" FROM "clinics";
DROP TABLE "clinics";
ALTER TABLE "new_clinics" RENAME TO "clinics";
CREATE UNIQUE INDEX "clinics_subdomain_key" ON "clinics"("subdomain");
CREATE TABLE "new_notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "offerId" TEXT,
    CONSTRAINT "notes_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "notes_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_notes" ("clinicId", "content", "createdAt", "id", "isPrivate", "offerId", "updatedAt", "userId") SELECT "clinicId", "content", "createdAt", "id", "isPrivate", "offerId", "updatedAt", "userId" FROM "notes";
DROP TABLE "notes";
ALTER TABLE "new_notes" RENAME TO "notes";
CREATE TABLE "new_offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalPrice" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "statusString" TEXT NOT NULL DEFAULT 'DRAFT',
    "validUntil" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "pdfTemplateId" TEXT,
    "estimatedDuration" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    "createdById" TEXT,
    "statusId" TEXT,
    CONSTRAINT "offers_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "clinic_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "offers_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "offer_statuses" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "offers_pdfTemplateId_fkey" FOREIGN KEY ("pdfTemplateId") REFERENCES "pdf_templates" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_offers" ("clinicId", "createdAt", "createdById", "currency", "description", "id", "isDeleted", "slug", "statusId", "title", "totalPrice", "updatedAt", "validUntil") SELECT "clinicId", "createdAt", "createdById", "currency", "description", "id", "isDeleted", "slug", "statusId", "title", "totalPrice", "updatedAt", "validUntil" FROM "offers";
DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
CREATE UNIQUE INDEX "offers_slug_key" ON "offers"("slug");
CREATE TABLE "new_patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "birthDate" DATETIME,
    "gender" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'TR',
    "nationality" TEXT NOT NULL DEFAULT 'TR',
    "phoneCountry" TEXT NOT NULL DEFAULT '+90',
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "referralSourceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "medicalHistory" TEXT,
    "allergies" TEXT,
    "medications" TEXT,
    "emergencyContact" TEXT,
    "clinicId" TEXT NOT NULL,
    "createdById" TEXT,
    CONSTRAINT "patients_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "patients_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "clinic_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "patients_referralSourceId_fkey" FOREIGN KEY ("referralSourceId") REFERENCES "referral_sources" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_patients" ("address", "allergies", "birthDate", "city", "clinicId", "country", "createdAt", "createdById", "email", "emergencyContact", "gender", "id", "isActive", "isDeleted", "medicalHistory", "name", "nationality", "notes", "phone", "phoneCountry", "referralSourceId", "updatedAt") SELECT "address", "allergies", "birthDate", "city", "clinicId", coalesce("country", 'TR') AS "country", "createdAt", "createdById", "email", "emergencyContact", "gender", "id", "isActive", "isDeleted", "medicalHistory", "name", coalesce("nationality", 'TR') AS "nationality", "notes", "phone", coalesce("phoneCountry", '+90') AS "phoneCountry", "referralSourceId", "updatedAt" FROM "patients";
DROP TABLE "patients";
ALTER TABLE "new_patients" RENAME TO "patients";
CREATE TABLE "new_pdf_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "pdf_templates_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pdf_templates" ("content", "createdAt", "description", "id", "isDefault", "name", "updatedAt") SELECT "content", "createdAt", "description", "id", "isDefault", "name", "updatedAt" FROM "pdf_templates";
DROP TABLE "pdf_templates";
ALTER TABLE "new_pdf_templates" RENAME TO "pdf_templates";
CREATE TABLE "new_referral_sources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "referral_sources_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_referral_sources" ("color", "createdAt", "description", "displayName", "id", "isActive", "name", "order", "updatedAt") SELECT "color", "createdAt", "description", "displayName", "id", "isActive", "name", "order", "updatedAt" FROM "referral_sources";
DROP TABLE "referral_sources";
ALTER TABLE "new_referral_sources" RENAME TO "referral_sources";
CREATE UNIQUE INDEX "referral_sources_name_key" ON "referral_sources"("name");
CREATE TABLE "new_support_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "support_categories_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_support_categories" ("createdAt", "description", "displayName", "id", "isActive", "name", "order", "updatedAt") SELECT "createdAt", "description", "displayName", "id", "isActive", "name", "order", "updatedAt" FROM "support_categories";
DROP TABLE "support_categories";
ALTER TABLE "new_support_categories" RENAME TO "support_categories";
CREATE TABLE "new_support_priorities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "support_priorities_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_support_priorities" ("color", "createdAt", "displayName", "id", "isActive", "level", "name", "updatedAt") SELECT "color", "createdAt", "displayName", "id", "isActive", "level", "name", "updatedAt" FROM "support_priorities";
DROP TABLE "support_priorities";
ALTER TABLE "new_support_priorities" RENAME TO "support_priorities";
CREATE TABLE "new_support_statuses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "support_statuses_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_support_statuses" ("color", "createdAt", "displayName", "id", "isActive", "name", "order", "updatedAt") SELECT "color", "createdAt", "displayName", "id", "isActive", "name", "order", "updatedAt" FROM "support_statuses";
DROP TABLE "support_statuses";
ALTER TABLE "new_support_statuses" RENAME TO "support_statuses";
CREATE TABLE "new_treatments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "category" TEXT NOT NULL DEFAULT 'general',
    "key" TEXT,
    "selectedTeeth" TEXT,
    "estimatedDuration" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "offerId" TEXT NOT NULL,
    CONSTRAINT "treatments_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_treatments" ("category", "createdAt", "currency", "description", "id", "key", "name", "offerId", "price", "quantity", "selectedTeeth", "updatedAt") SELECT coalesce("category", 'general') AS "category", "createdAt", coalesce("currency", 'TRY') AS "currency", "description", "id", "key", "name", "offerId", "price", "quantity", "selectedTeeth", "updatedAt" FROM "treatments";
DROP TABLE "treatments";
ALTER TABLE "new_treatments" RENAME TO "treatments";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "id", "name", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "role", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "patient_offers_patientId_offerId_key" ON "patient_offers"("patientId", "offerId");

-- CreateIndex
CREATE UNIQUE INDEX "clinic_users_email_key" ON "clinic_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "offer_statuses_name_key" ON "offer_statuses"("name");
