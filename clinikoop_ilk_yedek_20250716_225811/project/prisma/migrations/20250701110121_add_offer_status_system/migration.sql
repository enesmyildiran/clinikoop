/*
  Warnings:

  - You are about to drop the column `status` on the `offers` table. All the data in the column will be lost.
  - Added the required column `statusId` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "offer_statuses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Insert default statuses
INSERT INTO "offer_statuses" ("id", "name", "displayName", "color", "order", "isDefault", "isActive", "createdAt", "updatedAt") VALUES
('status_draft', 'draft', 'Taslak', '#6B7280', 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('status_sent', 'sent', 'Gönderildi', '#3B82F6', 1, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('status_pending', 'pending', 'İnceleniyor', '#F59E0B', 2, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('status_accepted', 'accepted', 'Kabul Edildi', '#10B981', 3, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('status_rejected', 'rejected', 'Reddedildi', '#EF4444', 4, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('status_expired', 'expired', 'Süresi Doldu', '#8B5CF6', 5, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

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
    "estimatedDays" INTEGER NOT NULL DEFAULT 0,
    "estimatedHours" INTEGER NOT NULL DEFAULT 0,
    "patientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "offers_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "offer_statuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copy data and map old status to new statusId
INSERT INTO "new_offers" ("id", "slug", "title", "description", "totalPrice", "currency", "statusId", "validUntil", "createdAt", "updatedAt", "isDeleted", "estimatedDays", "estimatedHours", "patientId", "userId")
SELECT 
    o."id",
    o."slug",
    o."title",
    o."description",
    o."totalPrice",
    o."currency",
    CASE 
        WHEN o."status" = 'DRAFT' THEN 'status_draft'
        WHEN o."status" = 'SENT' THEN 'status_sent'
        WHEN o."status" = 'PENDING' THEN 'status_pending'
        WHEN o."status" = 'ACCEPTED' THEN 'status_accepted'
        WHEN o."status" = 'REJECTED' THEN 'status_rejected'
        WHEN o."status" = 'EXPIRED' THEN 'status_expired'
        ELSE 'status_draft' -- Default to draft for unknown statuses
    END as "statusId",
    o."validUntil",
    o."createdAt",
    o."updatedAt",
    o."isDeleted",
    o."estimatedDays",
    o."estimatedHours",
    o."patientId",
    o."userId"
FROM "offers" o;

DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
CREATE UNIQUE INDEX "offers_slug_key" ON "offers"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "offer_statuses_name_key" ON "offer_statuses"("name");
