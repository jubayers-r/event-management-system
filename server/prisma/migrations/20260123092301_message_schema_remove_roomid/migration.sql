/*
  Warnings:

  - You are about to drop the column `roomId` on the `message` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "message_roomId_createdAt_idx";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "roomId";

-- CreateIndex
CREATE INDEX "message_ticketId_createdAt_idx" ON "message"("ticketId", "createdAt");
