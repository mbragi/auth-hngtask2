/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Organisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "orgId" TEXT NOT NULL;


-- Set default values for existing rows
UPDATE "Organisation" SET "userId" = 3 WHERE "userId" IS NULL;
UPDATE "User" SET "orgId" = 3 WHERE "orgId" IS NULL;

-- Make the columns NOT NULL
ALTER TABLE "Organisation" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "orgId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_userId_key" ON "Organisation"("userId");

-- AddForeignKey
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
