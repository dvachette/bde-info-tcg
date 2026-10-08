import { prisma } from "./prisma.js";
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