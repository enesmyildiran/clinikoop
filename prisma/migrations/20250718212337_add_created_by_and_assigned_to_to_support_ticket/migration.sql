-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_support_tickets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdById" TEXT,
    "assignedToId" TEXT,
    "clinicId" TEXT NOT NULL,
    CONSTRAINT "support_tickets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "support_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "clinic_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "clinic_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "clinic_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "support_tickets_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_support_tickets" ("authorId", "categoryId", "clinicId", "createdAt", "description", "id", "priority", "status", "title", "updatedAt") SELECT "authorId", "categoryId", "clinicId", "createdAt", "description", "id", "priority", "status", "title", "updatedAt" FROM "support_tickets";
DROP TABLE "support_tickets";
ALTER TABLE "new_support_tickets" RENAME TO "support_tickets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
