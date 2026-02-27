import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { QueueStatus } from "@prisma/client";
import { UpdateTicketStatusDTO } from "../types/index";
import { isValidTransition } from "../utils/queueStatus";

export const updateTicketStatus = async (
  req: Request<{ ticketId: string }, {}, UpdateTicketStatusDTO>,
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user || req.user.role !== "company") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const ticketId: number = Number(req.params.ticketId);
    const { status }: UpdateTicketStatusDTO = req.body;

    if (!Object.values(QueueStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const ticket = await prisma.queueTicket.findUnique({
      where: { id: ticketId },
      include: {
        session: {
          include: {
            room: true,
          },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // 1️⃣ Cari company berdasarkan user login
    const company = await prisma.company.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!company) {
      return res.status(403).json({ message: "Company not found" });
    }

    // 2️⃣ Pastikan room milik company
    if (ticket.session.room.companyId !== company.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!isValidTransition(ticket.status, status)) {
      return res.status(400).json({
        message: `Invalid transition from ${ticket.status} to ${status}`,
      });
    }

    const now = new Date();

    const updatedTicket = await prisma.$transaction(async (tx) => {
      // If serving → update session.calledNumber
      if (status === "serving") {
        await tx.queueSession.update({
          where: { id: ticket.sessionId },
          data: {
            calledNumber: ticket.number,
          },
        });
      }

      return tx.queueTicket.update({
        where: { id: ticketId },
        data: {
          status,
          calledAt: status === "serving" ? now : ticket.calledAt,
          completedAt:
            status === "done" || status === "skipped" || status === "cancelled"
              ? now
              : ticket.completedAt,
        },
      });
    });

    return res.json(updatedTicket);
  } catch (error) {
    console.error("UPDATE TICKET STATUS ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
