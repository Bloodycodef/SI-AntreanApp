// src/routes/auth.routes.ts
import { Router } from "express";
import { register } from "../controllers/auth";
import { verifyEmail } from "../controllers/auth";

const router = Router();

router.post("/register", register);
router.get("/verify-email", verifyEmail);

export default router;
