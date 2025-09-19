-- CreateEnum
CREATE TYPE "public"."DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_VALUE');

-- CreateTable
CREATE TABLE "public"."categoria" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "activeProducts" INTEGER NOT NULL DEFAULT 0,
    "totalValue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produto" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "discount" DECIMAL(10,2),
    "discountType" "public"."DiscountType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categoria_name_key" ON "public"."categoria"("name");

-- AddForeignKey
ALTER TABLE "public"."produto" ADD CONSTRAINT "produto_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
