/*
  Warnings:

  - You are about to drop the column `isActive` on the `offers` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `pdf_templates` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `reminders` table. All the data in the column will be lost.
  - You are about to drop the column `priorityId` on the `reminders` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `reminders` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `reminders` table. All the data in the column will be lost.
  - You are about to drop the column `authorName` on the `support_messages` table. All the data in the column will be lost.
  - You are about to drop the column `authorType` on the `support_messages` table. All the data in the column will be lost.
  - You are about to drop the column `isFromAdmin` on the `support_messages` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `support_tickets` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `support_tickets` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `treatments` table. All the data in the column will be lost.
  - Made the column `authorId` on table `support_messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdById` on table `support_tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject` on table `support_tickets` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "support_attachments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "filesize" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketId" TEXT NOT NULL,
    CONSTRAINT "support_attachments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalPrice" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "validUntil" DATETIME,
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
INSERT INTO "new_offers" ("clinicId", "createdAt", "createdById", "currency", "description", "estimatedDuration", "id", "isDeleted", "pdfTemplateId", "slug", "statusId", "title", "totalPrice", "updatedAt", "validUntil") SELECT "clinicId", "createdAt", "createdById", "currency", "description", "estimatedDuration", "id", "isDeleted", "pdfTemplateId", "slug", "statusId", "title", "totalPrice", "updatedAt", "validUntil" FROM "offers";
DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
CREATE UNIQUE INDEX "offers_slug_key" ON "offers"("slug");

-- PatientOffer migration with clinicId fix
CREATE TABLE "new_patient_offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "assigned" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "patient_offers_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "patient_offers_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "patient_offers_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Insert existing data with clinicId from related offer
INSERT INTO "new_patient_offers" ("assigned", "createdAt", "id", "offerId", "patientId", "updatedAt", "visible", "clinicId") 
SELECT 
    po."assigned", 
    po."createdAt", 
    po."id", 
    po."offerId", 
    po."patientId", 
    po."updatedAt", 
    po."visible",
    o."clinicId"  -- Get clinicId from related offer
FROM "patient_offers" po
JOIN "offers" o ON po."offerId" = o."id";

DROP TABLE "patient_offers";
ALTER TABLE "new_patient_offers" RENAME TO "patient_offers";
CREATE UNIQUE INDEX "patient_offers_patientId_offerId_key" ON "patient_offers"("patientId", "offerId");

CREATE TABLE "new_pdf_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "pdf_templates_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pdf_templates" ("clinicId", "content", "createdAt", "description", "id", "isDefault", "name", "updatedAt") SELECT "clinicId", "content", "createdAt", "description", "id", "isDefault", "name", "updatedAt" FROM "pdf_templates";
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
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "referral_sources_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_referral_sources" ("clinicId", "color", "createdAt", "description", "displayName", "id", "isActive", "name", "order", "updatedAt") SELECT "clinicId", "color", "createdAt", "description", "displayName", "id", "isActive", "name", "order", "updatedAt" FROM "referral_sources";
DROP TABLE "referral_sources";
ALTER TABLE "new_referral_sources" RENAME TO "referral_sources";
CREATE UNIQUE INDEX "referral_sources_name_key" ON "referral_sources"("name");
CREATE TABLE "new_reminders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" DATETIME NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT,
    "offerId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "reminders_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reminders_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reminders_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reminders" ("clinicId", "createdAt", "description", "dueDate", "id", "isPinned", "offerId", "patientId", "title", "updatedAt", "userId") SELECT "clinicId", "createdAt", "description", "dueDate", "id", "isPinned", "offerId", "patientId", "title", "updatedAt", "userId" FROM "reminders";
DROP TABLE "reminders";
ALTER TABLE "new_reminders" RENAME TO "reminders";
CREATE TABLE "new_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_settings" ("createdAt", "id", "key", "updatedAt", "value") SELECT "createdAt", "id", "key", "updatedAt", "value" FROM "settings";
DROP TABLE "settings";
ALTER TABLE "new_settings" RENAME TO "settings";
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");
CREATE TABLE "new_support_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "support_categories_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_support_categories" ("clinicId", "createdAt", "description", "displayName", "id", "isActive", "name", "order", "updatedAt") SELECT "clinicId", "createdAt", "description", "displayName", "id", "isActive", "name", "order", "updatedAt" FROM "support_categories";
DROP TABLE "support_categories";
ALTER TABLE "new_support_categories" RENAME TO "support_categories";
CREATE UNIQUE INDEX "support_categories_name_key" ON "support_categories"("name");
CREATE TABLE "new_support_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "support_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "support_messages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_support_messages" ("authorId", "content", "createdAt", "id", "ticketId", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "ticketId", "updatedAt" FROM "support_messages";
DROP TABLE "support_messages";
ALTER TABLE "new_support_messages" RENAME TO "support_messages";
CREATE TABLE "new_support_priorities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "support_priorities_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_support_priorities" ("clinicId", "color", "createdAt", "displayName", "id", "isActive", "level", "name", "updatedAt") SELECT "clinicId", "color", "createdAt", "displayName", "id", "isActive", "level", "name", "updatedAt" FROM "support_priorities";
DROP TABLE "support_priorities";
ALTER TABLE "new_support_priorities" RENAME TO "support_priorities";
CREATE UNIQUE INDEX "support_priorities_name_key" ON "support_priorities"("name");
CREATE TABLE "new_support_statuses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "support_statuses_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_support_statuses" ("clinicId", "color", "createdAt", "displayName", "id", "isActive", "name", "order", "updatedAt") SELECT "clinicId", "color", "createdAt", "displayName", "id", "isActive", "name", "order", "updatedAt" FROM "support_statuses";
DROP TABLE "support_statuses";
ALTER TABLE "new_support_statuses" RENAME TO "support_statuses";
CREATE UNIQUE INDEX "support_statuses_name_key" ON "support_statuses"("name");
CREATE TABLE "new_support_tickets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketNumber" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    "categoryId" TEXT,
    "priorityId" TEXT,
    "statusId" TEXT,
    "createdById" TEXT NOT NULL,
    "assignedToId" TEXT,
    CONSTRAINT "support_tickets_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "support_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "support_priorities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "support_statuses" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "clinic_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_support_tickets" ("assignedToId", "categoryId", "clinicId", "createdAt", "createdById", "description", "id", "isUrgent", "priorityId", "statusId", "subject", "ticketNumber", "updatedAt") SELECT "assignedToId", "categoryId", "clinicId", "createdAt", "createdById", "description", "id", "isUrgent", "priorityId", "statusId", "subject", "ticketNumber", "updatedAt" FROM "support_tickets";
DROP TABLE "support_tickets";
ALTER TABLE "new_support_tickets" RENAME TO "support_tickets";
CREATE UNIQUE INDEX "support_tickets_ticketNumber_key" ON "support_tickets"("ticketNumber");
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
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "offerId" TEXT NOT NULL,
    CONSTRAINT "treatments_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_treatments" ("category", "createdAt", "currency", "description", "estimatedDuration", "id", "isDeleted", "key", "name", "offerId", "order", "price", "quantity", "selectedTeeth", "updatedAt") SELECT "category", "createdAt", "currency", "description", "estimatedDuration", "id", "isDeleted", "key", "name", "offerId", "order", "price", "quantity", "selectedTeeth", "updatedAt" FROM "treatments";
DROP TABLE "treatments";
ALTER TABLE "new_treatments" RENAME TO "treatments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
