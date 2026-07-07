import { Router } from "express";

import { protect } from "../auth/auth.middleware";

import * as workspaceController from "./workspace.controller";

const router = Router();

router.post(
  "/",
  protect,
  workspaceController.createWorkspace
);

router.get(
  "/",
  protect,
  workspaceController.getMyWorkspaces
);

export default router;