-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('RECEBIDO', 'AGUARDANDO_PAGAMENTO', 'PAGAMENTO_APROVADO', 'PREPARO', 'ENVIADO_PARA_ENTREGA', 'ENTREGUE', 'CANCELADO', 'TENTATIVA_ENTREGA_FALHADA');

-- CreateEnum
CREATE TYPE "public"."CouponStatus" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "public"."pedidos" (
    "id" SERIAL NOT NULL,
    "precoTotal" DECIMAL(10,2) NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'RECEBIDO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "cupomId" INTEGER,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pedido_produto" (
    "id" SERIAL NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "pedido_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cupons" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "status" "public"."CouponStatus" NOT NULL DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pedido_produto_pedidoId_produtoId_key" ON "public"."pedido_produto"("pedidoId", "produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "cupons_codigo_key" ON "public"."cupons"("codigo");

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_cupomId_fkey" FOREIGN KEY ("cupomId") REFERENCES "public"."cupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedido_produto" ADD CONSTRAINT "pedido_produto_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedido_produto" ADD CONSTRAINT "pedido_produto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
