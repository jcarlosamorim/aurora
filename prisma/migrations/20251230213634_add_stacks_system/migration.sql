-- CreateTable
CREATE TABLE "Stack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "tools" TEXT NOT NULL,
    "profileMatch" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stackId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "Challenge_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserStack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stackId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "unlockedAt" DATETIME,
    "completedAt" DATETIME,
    "currentLevel" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "UserStack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserStack_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserChallenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "responses" TEXT,
    "score" INTEGER,
    CONSTRAINT "UserChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Stack_slug_key" ON "Stack"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_stackId_level_key" ON "Challenge"("stackId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "UserStack_userId_stackId_key" ON "UserStack"("userId", "stackId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChallenge_userId_challengeId_key" ON "UserChallenge"("userId", "challengeId");
