import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { JoinQueueDTO } from "../types/index";

export const joinQueue = async (
  req: Request<{}, {}, JoinQueueDTO>,
  res: Response,
) => {
  try {
    // 1️⃣ AUTH CHECK
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "company tidak bisa masuk antrean",
      });
    }

    const { secretKey } = req.body;

    if (!secretKey) {
      return res.status(400).json({
        message: "secretKey is required",
      });
    }

    // 2️⃣ FIND ROOM
    const room = await prisma.room.findUnique({
      where: { secretKey },
    });

    if (!room || !room.isActive) {
      return res.status(404).json({
        message: "room tidak ditemukan atau tidak aktif",
      });
    }

    // 3️⃣ FIND ACTIVE SESSION
    let session = await prisma.queueSession.findFirst({
      where: {
        roomId: room.id,
        status: "active",
      },
    });

    // 4️⃣ CREATE SESSION IF NONE
    if (!session) {
      session = await prisma.queueSession.create({
        data: {
          roomId: room.id,
        },
      });
    }

    // 5️⃣ CHECK DUPLICATE TICKET
    const existingTicket = await prisma.queueTicket.findUnique({
      where: {
        sessionId_userId: {
          sessionId: session.id,
          userId: req.user.id,
        },
      },
    });

    if (existingTicket) {
      return res.status(409).json({
        message: "kamu sudah mengambil nomor antrean",
        ticket: existingTicket,
      });
    }

    // 6️⃣ ISSUE NEXT NUMBER (TRANSACTION!)
    const ticket = await prisma.$transaction(async (tx) => {
      const updatedSession = await tx.queueSession.update({
        where: { id: session!.id },
        data: {
          currentNumber: { increment: 1 },
        },
      });

      return tx.queueTicket.create({
        data: {
          sessionId: session!.id,
          userId: req.user!.id,
          number: updatedSession.currentNumber,
        },
      });
    });

    return res.status(201).json({
      message: "berhasil masuk antrean",
      ticket,
    });
  } catch (error) {
    console.error("JOIN QUEUE ERROR:", error);

    return res.status(500).json({
      message: "gagal masuk antrean",
    });
  }
};
