/*
  Warnings:

  - You are about to drop the column `statusString` on the `offers` table. All the data in the column will be lost.

*/
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
INSERT INTO "new_offers" ("clinicId", "createdAt", "createdById", "currency", "description", "estimatedDuration", "id", "isActive", "isDeleted", "pdfTemplateId", "slug", "statusId", "title", "totalPrice", "updatedAt", "validUntil") SELECT "clinicId", "createdAt", "createdById", "currency", "description", "estimatedDuration", "id", "isActive", "isDeleted", "pdfTemplateId", "slug", "statusId", "title", "totalPrice", "updatedAt", "validUntil" FROM "offers";
DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
CREATE UNIQUE INDEX "offers_slug_key" ON "offers"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
