/*
  Warnings:

  - You are about to drop the `_AssignedOffers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AssignedPatients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `activity_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `analytics_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support_priorities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support_statuses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support_tickets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `system_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `clinicId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `offers` table. All the data in the column will be lost.
  - You are about to drop the column `visibleToAll` on the `offers` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `visibleToAll` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `clinicId` on the `reminders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_AssignedOffers_B_index";

-- DropIndex
DROP INDEX "_AssignedOffers_AB_unique";

-- DropIndex
DROP INDEX "_AssignedPatients_B_index";

-- DropIndex
DROP INDEX "_AssignedPatients_AB_unique";

-- DropIndex
DROP INDEX "support_categories_name_key";

-- DropIndex
DROP INDEX "support_priorities_level_key";

-- DropIndex
DROP INDEX "support_priorities_name_key";

-- DropIndex
DROP INDEX "support_statuses_name_key";

-- DropIndex
DROP INDEX "support_tickets_ticketNumber_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AssignedOffers";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AssignedPatients";
PRAGMA foreign_keys=on;

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
DROP TABLE "support_attachments";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "support_categories";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "support_messages";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "support_priorities";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "support_statuses";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "support_tickets";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "system_logs";
PRAGMA foreign_keys=on;

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
INSERT INTO "new_offers" ("clinicId", "createdAt", "currency", "description", "estimatedDays", "estimatedHours", "id", "isDeleted", "patientId", "slug", "statusId", "title", "totalPrice", "updatedAt", "userId", "validUntil") SELECT "clinicId", "createdAt", "currency", "description", "estimatedDays", "estimatedHours", "id", "isDeleted", "patientId", "slug", "statusId", "title", "totalPrice", "updatedAt", "userId", "validUntil" FROM "offers";
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
INSERT INTO "new_patients" ("address", "allergies", "birthDate", "city", "clinicId", "country", "createdAt", "email", "emergencyContact", "emergencyPhone", "facebook", "firstName", "gender", "id", "instagram", "insurance", "insuranceNumber", "isActive", "isDeleted", "lastName", "medicalHistory", "name", "nationality", "notes", "phone", "phoneCountry", "referralSourceId", "salesRepId", "updatedAt", "whatsapp") SELECT "address", "allergies", "birthDate", "city", "clinicId", "country", "createdAt", "email", "emergencyContact", "emergencyPhone", "facebook", "firstName", "gender", "id", "instagram", "insurance", "insuranceNumber", "isActive", "isDeleted", "lastName", "medicalHistory", "name", "nationality", "notes", "phone", "phoneCountry", "referralSourceId", "salesRepId", "updatedAt", "whatsapp" FROM "patients";
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
