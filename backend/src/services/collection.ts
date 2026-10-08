import { prisma } from "./prisma.js";
import type { Prisma } from "@prisma/client";
import { cardPool } from "#cards/index.js";

export interface CollectionEntry {
    readonly cardId: string;
    readonly quantity: number;
}

export class InvalidCardError extends Error { }
export class InvalidQuantityError extends Error { }

export async function getCollection(userId: string): Promise<CollectionEntry[]> {
    return prisma.collection.findMany({
        where: { userId },
        select: { cardId: true, quantity: true },
        orderBy: { acquiredAt: "asc" },
    });
}

export async function setQuantity(
    userId: string,
    cardId: string,
    quantity: number,
): Promise<void> {
    if (!Object.hasOwn(cardPool, cardId)) {
        throw new InvalidCardError(`Unknown card: ${cardId}`);
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
        throw new InvalidQuantityError(`Invalid quantity: ${quantity}`);
    }

    if (quantity === 0) {
        await prisma.collection.deleteMany({ where: { userId, cardId } });
        return;
    }

    await prisma.collection.upsert({
        where: { userId_cardId: { userId, cardId } },
        create: { userId, cardId, quantity },
        update: { quantity },
    });
}


export async function addCards(
    tx: Prisma.TransactionClient,
    userId: string,
    cardIds: readonly string[],
): Promise<void> {
    const counts: Map<string, number> = new Map();
    for (const cardId of cardIds) {
        if (!Object.hasOwn(cardPool, cardId)) {
            throw new InvalidCardError(`Unknown card: ${cardId}`);
        }
        counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
    }
    for (const [cardId, quantity] of counts) {
        await tx.collection.upsert({
            where: { userId_cardId: { userId, cardId } },
            create: { userId, cardId, quantity },
            update: { quantity: { increment: quantity } },
        });
    }
}

export async function getOwnedCardIds(
    tx: Prisma.TransactionClient,
    userId: string,
    cardIds: readonly string[],
): Promise<Set<string>> {
    const rows = await tx.collection.findMany({
        where: { userId, cardId: { in: [...new Set(cardIds)] }, quantity: { gt: 0 } },
        select: { cardId: true },
    });
    return new Set(rows.map((row) => row.cardId));
}