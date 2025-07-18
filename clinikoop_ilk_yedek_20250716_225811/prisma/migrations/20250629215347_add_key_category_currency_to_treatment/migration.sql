-- AlterTable
ALTER TABLE "treatments" ADD COLUMN "category" TEXT;
ALTER TABLE "treatments" ADD COLUMN "currency" TEXT DEFAULT 'TRY';
ALTER TABLE "treatments" ADD COLUMN "key" TEXT;
