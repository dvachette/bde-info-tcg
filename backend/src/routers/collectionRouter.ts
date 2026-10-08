import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/authMiddleware.js";
import {
    getMyCollection,
    getUserCollection,
    setUserCardQuantity,
} from "../controllers/collectionControllers.js";

export const collectionRouter: Router = Router();
collectionRouter.get("/", requireAuth, getMyCollection);

export const adminCollectionRouter: Router = Router();
adminCollectionRouter.use(requireAuth, requireAdmin);
adminCollectionRouter.get("/:userId", getUserCollection);
adminCollectionRouter.put("/:userId/:cardId", setUserCardQuantity);