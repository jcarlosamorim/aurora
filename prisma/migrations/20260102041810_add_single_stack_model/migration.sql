-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeStackId" TEXT,
    CONSTRAINT "User_activeStackId_fkey" FOREIGN KEY ("activeStackId") REFERENCES "Stack" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name") SELECT "createdAt", "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_UserStack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stackId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "unlockedAt" DATETIME,
    "completedAt" DATETIME,
    "currentLevel" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "UserStack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserStack_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserStack" ("completedAt", "currentLevel", "id", "stackId", "status", "unlockedAt", "userId") SELECT "completedAt", "currentLevel", "id", "stackId", "status", "unlockedAt", "userId" FROM "UserStack";
DROP TABLE "UserStack";
ALTER TABLE "new_UserStack" RENAME TO "UserStack";
CREATE INDEX "UserStack_userId_isActive_idx" ON "UserStack"("userId", "isActive");
CREATE UNIQUE INDEX "UserStack_userId_stackId_key" ON "UserStack"("userId", "stackId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
