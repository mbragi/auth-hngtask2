-- CreateTable
CREATE TABLE "Organisation" (
    "orgId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("orgId")
);
