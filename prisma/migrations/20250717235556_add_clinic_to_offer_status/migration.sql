-- Mevcut OfferStatus kayıtlarını sil (çünkü artık klinik bazlı olacak)
DELETE FROM "offer_statuses";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_offer_statuses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "offer_statuses_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "offer_statuses";
ALTER TABLE "new_offer_statuses" RENAME TO "offer_statuses";
CREATE UNIQUE INDEX "offer_statuses_name_clinicId_key" ON "offer_statuses"("name", "clinicId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
