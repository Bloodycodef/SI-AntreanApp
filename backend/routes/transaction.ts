import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { joinQueue } from "../controllers/joinqueue";

const router = Router();

router.post("/join", authenticate, joinQueue);

export default router;
