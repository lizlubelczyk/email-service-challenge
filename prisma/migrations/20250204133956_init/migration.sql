-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_senderEmail_key" ON "Email"("senderEmail");
