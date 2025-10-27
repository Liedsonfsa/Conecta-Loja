-- AlterTable
ALTER TABLE "public"."pedidos" ADD COLUMN     "enderecoId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "public"."enderecos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
