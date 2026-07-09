import { Router } from "express";
import { protect } from "../auth/auth.middleware";
import * as aiController from "./ai.controller";

const router = Router();

router.post("/developer-brief", protect, aiController.developerBrief);
router.post("/chat", protect, aiController.projectChat);
router.get("/health/:projectId", protect, aiController.projectHealth);
router.get("/onboarding/:projectId", protect, aiController.onboarding);

export default router;
