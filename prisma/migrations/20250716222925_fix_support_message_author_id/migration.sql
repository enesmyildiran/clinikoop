-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_support_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorId" TEXT,
    "authorName" TEXT NOT NULL,
    "authorType" TEXT NOT NULL,
    CONSTRAINT "support_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_support_messages" ("authorId", "authorName", "authorType", "content", "createdAt", "id", "isInternal", "ticketId", "updatedAt") SELECT "authorId", "authorName", "authorType", "content", "createdAt", "id", "isInternal", "ticketId", "updatedAt" FROM "support_messages";
DROP TABLE "support_messages";
ALTER TABLE "new_support_messages" RENAME TO "support_messages";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
