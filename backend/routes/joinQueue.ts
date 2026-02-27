import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { joinRoom } from "../controllers/joinqueue";

const router = Router();

router.post("/join", authenticate, joinRoom);

export default router;
