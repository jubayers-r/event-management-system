-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MANAGER', 'HOST');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
