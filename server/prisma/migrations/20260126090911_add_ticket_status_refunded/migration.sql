/*
  Warnings:

  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'REFUNDED';

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL;
