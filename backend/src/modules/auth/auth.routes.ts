import { Router } from "express";
import { protect } from "./auth.middleware";
import * as authController from "./auth.controller";

const router = Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/me", protect, authController.me);

export default router;