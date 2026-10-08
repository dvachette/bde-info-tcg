import { Router } from "express";
import { getCards } from "#controllers/cardController.js";

export const cardRouter: Router = Router();
cardRouter.get("/", getCards);