import type { Request, Response } from "express";
import { cardPool } from "../cards/index.js";

export function getCards(_req: Request, res: Response): void {
    res.status(200).json(cardPool);
}