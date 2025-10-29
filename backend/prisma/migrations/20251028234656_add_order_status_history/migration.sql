-- CreateTable
CREATE TABLE "public"."pedido_status_historico" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "status" "public"."OrderStatus" NOT NULL,
    "observacao" TEXT,
    "criadoPor" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedido_status_historico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."pedido_status_historico" ADD CONSTRAINT "pedido_status_historico_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedido_status_historico" ADD CONSTRAINT "pedido_status_historico_criadoPor_fkey" FOREIGN KEY ("criadoPor") REFERENCES "public"."funcionario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
