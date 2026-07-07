import { Router } from "express";

import { protect } from "../auth/auth.middleware";

import * as projectController from "./project.controller";

const router = Router();

router.post(
  "/",
  protect,
  projectController.createProject
);

router.get(
  "/workspace/:workspaceId",
  protect,
  projectController.getProjects
);

router.patch(
  "/:projectId",
  protect,
  projectController.updateProject
);

export default router;