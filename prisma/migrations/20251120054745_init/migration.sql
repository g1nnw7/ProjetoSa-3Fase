-- CreateTable
CREATE TABLE "alimentos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "gramas" DOUBLE PRECISION NOT NULL,
    "calorias" DOUBLE PRECISION NOT NULL,
    "proteinas" DOUBLE PRECISION NOT NULL,
    "carboidratos" DOUBLE PRECISION NOT NULL,
    "gorduras" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "alimentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alimentos_nome_key" ON "alimentos"("nome");
