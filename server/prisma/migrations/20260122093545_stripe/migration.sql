/*
  Warnings:

  - A unique constraint covering the columns `[stripeSessionId]` on the table `ticket` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "ticket" ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "stripeSessionId" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ticket_stripeSessionId_key" ON "ticket"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_stripeCustomerId_key" ON "user"("stripeCustomerId");
