import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.js";

export async function withUserLock<T>(
    userId: string,
    work: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}))`;
        return work(tx);
    });
}
