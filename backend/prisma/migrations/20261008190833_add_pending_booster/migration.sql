-- CreateTable
CREATE TABLE "PendingBooster" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "boosterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingBooster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PendingBooster_userId_createdAt_idx" ON "PendingBooster"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "PendingBooster" ADD CONSTRAINT "PendingBooster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
