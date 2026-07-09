import { Router } from "express";
import { protect } from "../auth/auth.middleware";
import * as aiController from "./ai.controller";

const router = Router();

router.post(
  "/developer-brief",
  protect,
  aiController.developerBrief
);

export default router;