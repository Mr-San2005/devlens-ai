import { Router } from "express";

import { protect } from "../auth/auth.middleware";
import * as taskController from "./task.controller";

const router = Router();

router.post(
  "/",
  protect,
  taskController.createTask
);

router.get(
  "/project/:projectId",
  protect,
  taskController.getProjectTasks
);

router.patch(
  "/:taskId",
  protect,
  taskController.updateTaskStatus
);

router.patch(
  "/:taskId/assign",
  protect,
  taskController.assignTask
);

export default router;