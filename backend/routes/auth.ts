// src/routes/auth.routes.ts
import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  refreshToken,
  logout,
} from "../controllers/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.get("refresh-token", refreshToken);
export default router;
