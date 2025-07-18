-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_treatments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "key" TEXT,
    "category" TEXT,
    "currency" TEXT DEFAULT 'TRY',
    "description" TEXT,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "selectedTeeth" TEXT,
    "estimatedDays" INTEGER NOT NULL DEFAULT 0,
    "estimatedHours" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "offerId" TEXT NOT NULL,
    CONSTRAINT "treatments_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_treatments" ("category", "createdAt", "currency", "description", "id", "key", "name", "offerId", "price", "quantity", "selectedTeeth", "updatedAt") SELECT "category", "createdAt", "currency", "description", "id", "key", "name", "offerId", "price", "quantity", "selectedTeeth", "updatedAt" FROM "treatments";
DROP TABLE "treatments";
ALTER TABLE "new_treatments" RENAME TO "treatments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
