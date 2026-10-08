import type { Request, Response } from "express";
import { prisma } from "#services/prisma.js";
import {
    getCollection,
    setQuantity,
    InvalidCardError,
    InvalidQuantityError,
} from "../services/collection.js";
import {
    cardParamsSchema,
    setQuantitySchema,
    userIdParamSchema,
} from "../services/validation.js";

async function userExists(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    return user !== null;
}

function sendServerError(res: Response): void {
    res.status(500).json({ error: "Internal server error" });
}

export async function getMyCollection(req: Request, res: Response): Promise<void> {
    if (req.userId === undefined) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        res.status(200).json(await getCollection(req.userId));
    } catch {
        sendServerError(res);
    }
}

export async function getUserCollection(req: Request, res: Response): Promise<void> {
    const params = userIdParamSchema.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid user id" });
        return;
    }
    try {
        if (!(await userExists(params.data.userId))) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(await getCollection(params.data.userId));
    } catch {
        sendServerError(res);
    }
}

export async function setUserCardQuantity(req: Request, res: Response): Promise<void> {
    const params = cardParamsSchema.safeParse(req.params);
    const body = setQuantitySchema.safeParse(req.body);
    if (!params.success || !body.success) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }
    const { userId, cardId } = params.data;
    const { quantity } = body.data;
    try {
        if (!(await userExists(userId))) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        await setQuantity(userId, cardId, quantity);
        res.status(200).json({ cardId, quantity });
    } catch (error: unknown) {
        if (error instanceof InvalidCardError || error instanceof InvalidQuantityError) {
            res.status(400).json({ error: error.message });
            return;
        }
        sendServerError(res);
    }
}