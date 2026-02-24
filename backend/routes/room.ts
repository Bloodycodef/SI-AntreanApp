import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
  getRooms,
  storeRoom,
  deleteRoom,
  updateRoom,
} from "../controllers/room";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

router.post("/", authenticate, requireRole(["company"]), storeRoom);
router.get("/", authenticate, getRooms);
router.put("/:id", authenticate, updateRoom);
router.delete("/:id", authenticate, deleteRoom);

export default router;
