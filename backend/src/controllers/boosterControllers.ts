import type { Request, Response } from "express";
import {
    getPendingBoosters,
    grantBooster,
    openNextBooster,
    InvalidBoosterError,
    InvalidGrantCountError,
} from "../services/boosters.js";
import { userExists } from "../services/userLookup.js";
import { grantBoosterSchema, userIdParamSchema } from "../services/validation.js";

function sendServerError(res: Response): void {
    res.status(500).json({ error: "Internal server error" });
}

export async function grantUserBooster(req: Request, res: Response): Promise<void> {
    const params = userIdParamSchema.safeParse(req.params);
    const body = grantBoosterSchema.safeParse(req.body);
    if (!params.success || !body.success) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }
    const { userId } = params.data;
    const { boosterId, count } = body.data;
    try {
        if (!(await userExists(userId))) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        await grantBooster(userId, boosterId, count);
        res.status(201).json({ boosterId, count: count ?? 1 });
    } catch (error: unknown) {
        if (error instanceof InvalidBoosterError || error instanceof InvalidGrantCountError) {
            res.status(400).json({ error: error.message });
            return;
        }
        sendServerError(res);
    }
}

export async function getMyPendingBoosters(req: Request, res: Response): Promise<void> {
    if (req.userId === undefined) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        res.status(200).json(await getPendingBoosters(req.userId));
    } catch {
        sendServerError(res);
    }
}

export async function openMyNextBooster(req: Request, res: Response): Promise<void> {
    if (req.userId === undefined) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const opened = await openNextBooster(req.userId);
        if (opened === null) {
            res.status(404).json({ error: "No pending booster" });
            return;
        }
        res.status(200).json(opened);
    } catch {
        sendServerError(res);
    }
}