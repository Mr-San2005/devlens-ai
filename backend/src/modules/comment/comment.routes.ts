import { Router } from "express";

import * as commentController from "./comment.controller";

import { protect } from "../auth/auth.middleware";

const router = Router();

router.post(
  "/",
  protect,
  commentController.createComment
);

router.get(
  "/task/:taskId",
  protect,
  commentController.getCommentsByTask
);

export default router;