-- CreateTable
CREATE TABLE "Fatura" (
    "id" TEXT NOT NULL,
    "clienteCodigo" TEXT NOT NULL,
    "clienteNome" TEXT NOT NULL,
    "clienteEndereco" TEXT NOT NULL,
    "instalacaoCodigo" TEXT NOT NULL,
    "vencimentoData" TIMESTAMP(3) NOT NULL,
    "total" INTEGER NOT NULL,
    "accessKey" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaturaItem" (
    "id" TEXT NOT NULL,
    "faturaId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaturaItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FaturaItem" ADD CONSTRAINT "FaturaItem_faturaId_fkey" FOREIGN KEY ("faturaId") REFERENCES "Fatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
