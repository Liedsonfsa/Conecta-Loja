/*
  Warnings:

  - You are about to drop the column `role` on the `funcionario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `funcionario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."funcionario" DROP COLUMN "role",
ADD COLUMN     "cargoId" INTEGER;

-- AlterTable
ALTER TABLE "public"."pedido_produto" ADD COLUMN     "precoUnitario" DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "public"."store" ADD COLUMN     "accent_color" TEXT DEFAULT '#F59E0B',
ADD COLUMN     "banner_image_url" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "custom_css" TEXT,
ADD COLUMN     "footer_message" TEXT,
ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "primary_color" TEXT DEFAULT '#2563EB',
ADD COLUMN     "secondary_color" TEXT DEFAULT '#059669',
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "theme" TEXT DEFAULT 'modern',
ADD COLUMN     "welcome_message" TEXT,
ADD COLUMN     "zip_code" TEXT;

-- CreateTable
CREATE TABLE "public"."cargo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."carrinhos" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carrinhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."carrinho_produto" (
    "id" SERIAL NOT NULL,
    "carrinhoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "carrinho_produto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cargo_name_key" ON "public"."cargo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "carrinhos_usuarioId_key" ON "public"."carrinhos"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "carrinho_produto_carrinhoId_produtoId_key" ON "public"."carrinho_produto"("carrinhoId", "produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "funcionario_email_key" ON "public"."funcionario"("email");

-- AddForeignKey
ALTER TABLE "public"."funcionario" ADD CONSTRAINT "funcionario_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "public"."cargo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carrinhos" ADD CONSTRAINT "carrinhos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carrinho_produto" ADD CONSTRAINT "carrinho_produto_carrinhoId_fkey" FOREIGN KEY ("carrinhoId") REFERENCES "public"."carrinhos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carrinho_produto" ADD CONSTRAINT "carrinho_produto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
