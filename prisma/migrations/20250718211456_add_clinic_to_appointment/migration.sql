/*
  Warnings:

  - Added the required column `clinicId` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
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
    CONSTRAINT "appointments_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "appointments_relatedOfferId_fkey" FOREIGN KEY ("relatedOfferId") REFERENCES "offers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_appointments" ("appointmentType", "createdAt", "doctorId", "durationMinutes", "endTime", "id", "isBlockage", "notes", "patientId", "relatedOfferId", "startTime", "status", "updatedAt") SELECT "appointmentType", "createdAt", "doctorId", "durationMinutes", "endTime", "id", "isBlockage", "notes", "patientId", "relatedOfferId", "startTime", "status", "updatedAt" FROM "appointments";
DROP TABLE "appointments";
ALTER TABLE "new_appointments" RENAME TO "appointments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
