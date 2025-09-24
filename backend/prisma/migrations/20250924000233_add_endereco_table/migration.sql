-- CreateTable
CREATE TABLE "public"."enderecos" (
    "id" SERIAL NOT NULL,
    "cep" VARCHAR(10) NOT NULL,
    "logradouro" VARCHAR(255) NOT NULL,
    "numero" VARCHAR(10) NOT NULL,
    "complemento" VARCHAR(100),
    "informacoes_adicionais" VARCHAR(255),
    "bairro" VARCHAR(100) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."enderecos" ADD CONSTRAINT "enderecos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
