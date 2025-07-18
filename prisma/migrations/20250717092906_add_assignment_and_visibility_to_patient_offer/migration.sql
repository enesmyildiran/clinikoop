/*
  Warnings:

  - Added the required column `createdById` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_AssignedPatients" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AssignedPatients_A_fkey" FOREIGN KEY ("A") REFERENCES "clinic_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AssignedPatients_B_fkey" FOREIGN KEY ("B") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AssignedOffers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AssignedOffers_A_fkey" FOREIGN KEY ("A") REFERENCES "clinic_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AssignedOffers_B_fkey" FOREIGN KEY ("B") REFERENCES "offers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "createdById" TEXT NOT NULL,
    "visibleToAll" BOOLEAN NOT NULL DEFAULT false,
    "estimatedDays" INTEGER NOT NULL DEFAULT 0,
    "estimatedHours" INTEGER NOT NULL DEFAULT 0,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "offers_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "offer_statuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_offers" ("clinicId", "createdAt", "currency", "description", "estimatedDays", "estimatedHours", "id", "isDeleted", "patientId", "slug", "statusId", "title", "totalPrice", "updatedAt", "userId", "validUntil", "createdById", "visibleToAll")
SELECT "clinicId", "createdAt", "currency", "description", "estimatedDays", "estimatedHours", "id", "isDeleted", "patientId", "slug", "statusId", "title", "totalPrice", "updatedAt", "userId", "validUntil", (SELECT id FROM clinic_users LIMIT 1), false FROM "offers";
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
    "createdById" TEXT NOT NULL,
    "visibleToAll" BOOLEAN NOT NULL DEFAULT false,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "patients_referralSourceId_fkey" FOREIGN KEY ("referralSourceId") REFERENCES "referral_sources" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "patients_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "patients_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_patients" ("address", "allergies", "birthDate", "city", "clinicId", "country", "createdAt", "email", "emergencyContact", "emergencyPhone", "facebook", "firstName", "gender", "id", "instagram", "insurance", "insuranceNumber", "isActive", "isDeleted", "lastName", "medicalHistory", "name", "nationality", "notes", "phone", "phoneCountry", "referralSourceId", "salesRepId", "updatedAt", "whatsapp", "createdById", "visibleToAll")
SELECT "address", "allergies", "birthDate", "city", "clinicId", "country", "createdAt", "email", "emergencyContact", "emergencyPhone", "facebook", "firstName", "gender", "id", "instagram", "insurance", "insuranceNumber", "isActive", "isDeleted", "lastName", "medicalHistory", "name", "nationality", "notes", "phone", "phoneCountry", "referralSourceId", "salesRepId", "updatedAt", "whatsapp", (SELECT id FROM clinic_users LIMIT 1), false FROM "patients";
DROP TABLE "patients";
ALTER TABLE "new_patients" RENAME TO "patients";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_AssignedPatients_AB_unique" ON "_AssignedPatients"("A", "B");

-- CreateIndex
CREATE INDEX "_AssignedPatients_B_index" ON "_AssignedPatients"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AssignedOffers_AB_unique" ON "_AssignedOffers"("A", "B");

-- CreateIndex
CREATE INDEX "_AssignedOffers_B_index" ON "_AssignedOffers"("B");
