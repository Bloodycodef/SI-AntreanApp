import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { JoinRoomAnswerDTO, JoinRoomDTO } from "../types/index";
import { QueueStatus } from "@prisma/client";

export const joinRoom = async (
  req: Request<{}, {}, JoinRoomDTO>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { secretKey, answers } = req.body;

    // 1️⃣ Find room + active session
    const room = await prisma.room.findUnique({
      where: { secretKey },
      include: {
        formFields: true,
        sessions: {
          where: { status: "active" },
          take: 1,
        },
      },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 1️⃣ Cari active session
    let activeSession = await prisma.queueSession.findFirst({
      where: {
        roomId: room.id,
        status: "active",
      },
    });

    // 2️⃣ Jika tidak ada, buat baru
    if (!activeSession) {
      activeSession = await prisma.queueSession.create({
        data: {
          roomId: room.id,
          status: "active",
          currentNumber: 0,
          calledNumber: 0,
        },
      });
    }

    // 2️⃣ Validate field ownership
    const validFieldIds = new Set(room.formFields.map((f) => f.id));

    for (const answer of answers) {
      if (!validFieldIds.has(answer.fieldId)) {
        return res.status(400).json({
          message: "Invalid field submitted",
        });
      }
    }

    // 3️⃣ Validate required fields
    const requiredFields = room.formFields.filter((f) => f.required);

    for (const field of requiredFields) {
      const answered = answers.find(
        (a) => a.fieldId === field.id && a.value.trim() !== "",
      );

      if (!answered) {
        return res.status(400).json({
          message: `Field "${field.label}" is required`,
        });
      }
    }

    // 4️⃣ Prevent duplicate ticket
    const existingTicket = await prisma.queueTicket.findUnique({
      where: {
        sessionId_userId: {
          sessionId: activeSession.id,
          userId: req.user.id,
        },
      },
    });

    if (existingTicket) {
      return res.status(400).json({
        message: "You already joined this queue",
      });
    }

    // 5️⃣ Transaction
    const ticket = await prisma.$transaction(async (tx) => {
      const updatedSession = await tx.queueSession.update({
        where: { id: activeSession.id },
        data: {
          currentNumber: { increment: 1 },
        },
      });

      const newTicket = await tx.queueTicket.create({
        data: {
          sessionId: activeSession.id,
          userId: req.user!.id,
          number: updatedSession.currentNumber,
          status: QueueStatus.waiting,
        },
      });

      await tx.ticketFormAnswer.createMany({
        data: answers.map((a) => ({
          ticketId: newTicket.id,
          fieldId: a.fieldId,
          value: a.value,
        })),
      });

      return newTicket;
    });

    return res.status(201).json(ticket);
  } catch (error) {
    console.error("JOIN ROOM ERROR:", error);
    return res.status(500).json({
      message: "Failed to join room",
    });
  }
};
