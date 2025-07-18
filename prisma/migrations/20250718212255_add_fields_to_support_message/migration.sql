-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_support_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "authorName" TEXT,
    "authorType" TEXT NOT NULL DEFAULT 'USER',
    "isFromAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorId" TEXT,
    CONSTRAINT "support_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "support_messages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "clinic_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_support_messages" ("authorId", "content", "createdAt", "id", "isFromAdmin", "ticketId", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "isFromAdmin", "ticketId", "updatedAt" FROM "support_messages";
DROP TABLE "support_messages";
ALTER TABLE "new_support_messages" RENAME TO "support_messages";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
