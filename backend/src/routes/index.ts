import { Router } from "express";
import healthRoutes from "../modules/health/health.routes";
import authRoutes from "../modules/auth/auth.routes";
import workspaceRoutes from "../modules/workspace/workspace.routes";
import projectRoutes from "../modules/project/project.routes";
import taskRoutes from "../modules/task/task.routes";
import commentRoutes from "../modules/comment/comment.routes";

const router = Router();
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/workspaces",workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);           
router.use("/comments", commentRoutes);

export default router;