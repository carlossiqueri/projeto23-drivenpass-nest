-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);
