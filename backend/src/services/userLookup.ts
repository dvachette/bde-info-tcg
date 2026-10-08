import { prisma } from "./prisma.js";

export async function userExists(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    return user !== null;
}