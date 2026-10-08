import type { Prisma } from "@prisma/client";
import { boosterPool } from "../boosters/index.js";
import type { DrawableBooster } from "../boosters/Booster.js";
import { prisma } from "./prisma.js";
import { addCards, getOwnedCardIds } from "./collection.js";
import { withUserLock } from "./userLock.js";

export const MAX_GRANT_COUNT: number = 10;
const KNOWN_BOOSTER_IDS: readonly string[] = Object.keys(boosterPool);

export class InvalidBoosterError extends Error { }
export class InvalidGrantCountError extends Error { }

export interface PendingBoosterEntry {
    readonly id: string;
    readonly boosterId: string;
}

export interface OpenedCard {
    readonly cardId: string;
    readonly isNew: boolean;
}

export interface OpenedBooster {
    readonly boosterId: string;
    readonly cards: OpenedCard[];
}

function toOpenedCards(cardIds: readonly string[], owned: ReadonlySet<string>): OpenedCard[] {
    const seen: Set<string> = new Set(owned);
    return cardIds.map((cardId: string) => {
        const isNew: boolean = !seen.has(cardId);
        seen.add(cardId);
        return { cardId, isNew };
    });
}

export async function grantBooster(
    userId: string,
    boosterId: string,
    count: number = 1,
): Promise<void> {
    if (!Object.hasOwn(boosterPool, boosterId)) {
        throw new InvalidBoosterError(`Unknown booster: ${boosterId}`);
    }
    if (!Number.isInteger(count) || count < 1 || count > MAX_GRANT_COUNT) {
        throw new InvalidGrantCountError(`Invalid count: ${count}`);
    }
    await prisma.pendingBooster.createMany({
        data: Array.from({ length: count }, () => ({ userId, boosterId })),
    });
}

export async function getPendingBoosters(userId: string): Promise<PendingBoosterEntry[]> {
    return prisma.pendingBooster.findMany({
        where: { userId, boosterId: { in: [...KNOWN_BOOSTER_IDS] } },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true, boosterId: true },
    });
}

export async function openNextBooster(userId: string): Promise<OpenedBooster | null> {
    return withUserLock(userId, async (tx: Prisma.TransactionClient) => {
        const pending = await tx.pendingBooster.findFirst({
            where: { userId, boosterId: { in: [...KNOWN_BOOSTER_IDS] } },
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        });
        if (pending === null) {
            return null;
        }
        const booster: DrawableBooster | undefined = boosterPool[pending.boosterId];
        if (booster === undefined) {
            throw new InvalidBoosterError(`Unknown booster: ${pending.boosterId}`);
        }
        await tx.pendingBooster.delete({ where: { id: pending.id } });
        const cardIds: string[] = booster.draw();
        const owned: Set<string> = await getOwnedCardIds(tx, userId, cardIds);
        await addCards(tx, userId, cardIds);
        return { boosterId: booster.id, cards: toOpenedCards(cardIds, owned) };
    });
}