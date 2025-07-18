/*
  Warnings:

  - You are about to drop the column `priority` on the `reminders` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `support_tickets` table. All the data in the column will be lost.

*/
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
    "priorityId" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "offerId" TEXT,
    "patientId" TEXT,
    CONSTRAINT "reminders_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "support_priorities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reminders_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reminders_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reminders_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_reminders" ("clinicId", "createdAt", "description", "dueDate", "id", "isPinned", "isPrivate", "offerId", "patientId", "reason", "status", "title", "updatedAt", "userId") SELECT "clinicId", "createdAt", "description", "dueDate", "id", "isPinned", "isPrivate", "offerId", "patientId", "reason", "status", "title", "updatedAt", "userId" FROM "reminders";
DROP TABLE "reminders";
ALTER TABLE "new_reminders" RENAME TO "reminders";
CREATE TABLE "new_support_tickets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "priorityId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdById" TEXT,
    "assignedToId" TEXT,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "support_tickets_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "support_priorities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "support_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "clinic_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "clinic_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_support_tickets" ("assignedToId", "authorId", "categoryId", "clinicId", "createdAt", "createdById", "description", "id", "status", "title", "updatedAt") SELECT "assignedToId", "authorId", "categoryId", "clinicId", "createdAt", "createdById", "description", "id", "status", "title", "updatedAt" FROM "support_tickets";
DROP TABLE "support_tickets";
ALTER TABLE "new_support_tickets" RENAME TO "support_tickets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
