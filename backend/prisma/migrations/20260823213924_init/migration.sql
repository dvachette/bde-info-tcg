-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLAYER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RefreshTokenStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "CombatStatus" AS ENUM ('ONGOING', 'FINISHED');

-- CreateEnum
CREATE TYPE "CombatEndReason" AS ENUM ('HP_ZERO', 'FORFEIT', 'DISCONNECT_TIMEOUT', 'SERVER_CRASH_DRAW');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "ShopOfferType" AS ENUM ('CARD', 'PACK', 'BOOSTER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PLAYER',
    "keysBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "jti" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "status" "RefreshTokenStatus" NOT NULL DEFAULT 'ACTIVE',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "replacedBy" TEXT,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("jti")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deck" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "memberCardIds" TEXT[],
    "petCardId" TEXT NOT NULL,
    "arenaCardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_replacedBy_key" ON "RefreshToken"("replacedBy");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_userId_cardId_key" ON "Collection"("userId", "cardId");

-- CreateIndex
CREATE UNIQUE INDEX "Deck_userId_name_key" ON "Deck"("userId", "name");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
