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
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "validUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "estimatedDays" INTEGER NOT NULL DEFAULT 0,
    "estimatedHours" INTEGER NOT NULL DEFAULT 0,
    "patientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "offers_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_offers" ("createdAt", "currency", "description", "id", "isDeleted", "patientId", "slug", "status", "title", "totalPrice", "updatedAt", "userId", "validUntil") SELECT "createdAt", "currency", "description", "id", "isDeleted", "patientId", "slug", "status", "title", "totalPrice", "updatedAt", "userId", "validUntil" FROM "offers";
DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
CREATE UNIQUE INDEX "offers_slug_key" ON "offers"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
