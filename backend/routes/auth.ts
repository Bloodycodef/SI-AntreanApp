// src/routes/auth.routes.ts
import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  refreshToken,
  logout,
  getMe,
} from "../controllers/auth";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.get("/verify-email", verifyEmail);
router.get("/refresh-token", refreshToken);
export default router;
