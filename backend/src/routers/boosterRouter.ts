import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/authMiddleware.js";
import {
    getMyPendingBoosters,
    grantUserBooster,
    openMyNextBooster,
} from "../controllers/boosterControllers.js";

export const boosterRouter: Router = Router();
boosterRouter.get("/pending", requireAuth, getMyPendingBoosters);
boosterRouter.post("/open", requireAuth, openMyNextBooster);

export const adminBoosterRouter: Router = Router();
adminBoosterRouter.use(requireAuth, requireAdmin);
adminBoosterRouter.post("/:userId", grantUserBooster);