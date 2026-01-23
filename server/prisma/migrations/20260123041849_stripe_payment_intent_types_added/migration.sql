/*
  Warnings:

  - You are about to drop the column `stripeSessionId` on the `ticket` table. All the data in the column will be lost.
  - Added the required column `amount` to the `ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ticket_stripeSessionId_key";

-- AlterTable
ALTER TABLE "ticket" DROP COLUMN "stripeSessionId",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "paymentIntentId" TEXT;
