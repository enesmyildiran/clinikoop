-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "patients_referralSourceId_fkey" FOREIGN KEY ("referralSourceId") REFERENCES "referral_sources" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_patients" ("address", "allergies", "birthDate", "country", "createdAt", "email", "facebook", "id", "instagram", "isDeleted", "medicalHistory", "name", "nationality", "notes", "phone", "phoneCountry", "referralSourceId", "salesRepId", "updatedAt", "whatsapp") SELECT "address", "allergies", "birthDate", "country", "createdAt", "email", "facebook", "id", "instagram", "isDeleted", "medicalHistory", "name", "nationality", "notes", "phone", "phoneCountry", "referralSourceId", "salesRepId", "updatedAt", "whatsapp" FROM "patients";
DROP TABLE "patients";
ALTER TABLE "new_patients" RENAME TO "patients";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
