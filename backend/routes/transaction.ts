import { Express } from "express";
import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { updateTicketStatus } from "../controllers/updateTicket";

const router = Router();

router.patch("/ticket/:ticketId/status", authenticate, updateTicketStatus);

export default router;
