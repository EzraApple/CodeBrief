/*
  Warnings:

  - You are about to drop the column `repoTreeId` on the `Report` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repoUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "repoContextId" TEXT,
    "modelResponse" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_repoContextId_fkey" FOREIGN KEY ("repoContextId") REFERENCES "RepoContext" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("createdAt", "id", "modelResponse", "repoContextId", "repoUrl", "status", "updatedAt", "userId") SELECT "createdAt", "id", "modelResponse", "repoContextId", "repoUrl", "status", "updatedAt", "userId" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
