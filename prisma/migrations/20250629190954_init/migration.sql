/*
  Warnings:

  - You are about to drop the column `isCompleted` on the `reminders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN "referralSource" TEXT;
ALTER TABLE "patients" ADD COLUMN "salesRepId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reminders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "offerId" TEXT,
    "patientId" TEXT,
    CONSTRAINT "reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reminders_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reminders_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_reminders" ("createdAt", "description", "dueDate", "id", "isPrivate", "offerId", "patientId", "priority", "title", "updatedAt", "userId") SELECT "createdAt", "description", "dueDate", "id", "isPrivate", "offerId", "patientId", "priority", "title", "updatedAt", "userId" FROM "reminders";
DROP TABLE "reminders";
ALTER TABLE "new_reminders" RENAME TO "reminders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
