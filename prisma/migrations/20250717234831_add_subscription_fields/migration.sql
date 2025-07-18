/*
  Warnings:

  - You are about to drop the `_ClinicToClinicPackage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_ClinicToClinicPackage_B_index";

-- DropIndex
DROP INDEX "_ClinicToClinicPackage_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ClinicToClinicPackage";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clinics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "domain" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxUsers" INTEGER NOT NULL DEFAULT 5,
    "maxPatients" INTEGER NOT NULL DEFAULT 100,
    "maxOffers" INTEGER NOT NULL DEFAULT 500,
    "subscriptionStartDate" DATETIME,
    "subscriptionEndDate" DATETIME,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'TRIAL',
    "packageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "clinics_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "clinic_packages" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_clinics" ("createdAt", "domain", "id", "isActive", "maxOffers", "maxPatients", "maxUsers", "name", "subdomain", "updatedAt") SELECT "createdAt", "domain", "id", "isActive", "maxOffers", "maxPatients", "maxUsers", "name", "subdomain", "updatedAt" FROM "clinics";
DROP TABLE "clinics";
ALTER TABLE "new_clinics" RENAME TO "clinics";
CREATE UNIQUE INDEX "clinics_subdomain_key" ON "clinics"("subdomain");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
