/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "public"."usuario" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contact" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."funcionario" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "lojaId" INTEGER NOT NULL,

    CONSTRAINT "funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."funcionario" ADD CONSTRAINT "funcionario_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "public"."store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
