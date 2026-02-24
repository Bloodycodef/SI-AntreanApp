import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import crypto from "crypto";
import { CreateRoomDTO, UpdateRoomDTO } from "../types/index";

// Company can add Room
export const storeRoom = async (
  req: Request<{}, {}, CreateRoomDTO>,
  res: Response,
) => {
  try {
    // 1️⃣ AUTH GUARD (MOST IMPORTANT)
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // 2️⃣ ROLE GUARD
    if (req.user.role !== "company") {
      return res.status(403).json({
        message: "hanya admin yang bisa membuat room",
      });
    }

    // 3️⃣ FIND COMPANY (SAFE: userId is guaranteed)
    const company = await prisma.company.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!company) {
      return res.status(404).json({
        message: "company not found",
      });
    }

    // 4️⃣ CREATE ROOM
    const room = await prisma.room.create({
      data: {
        companyId: company.id,
        name: req.body.name,
        description: req.body.description,
        secretKey: crypto.randomBytes(4).toString("hex"),
      },
    });

    return res.status(201).json(room);
  } catch (error) {
    console.error("STORE ROOM ERROR:", error);

    return res.status(500).json({
      message: "failed to create room",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getRooms = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const company = await prisma.company.findUnique({
      where: { userId: req.user.id },
      include: { rooms: true },
    });

    if (!company) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(company.rooms);
  } catch {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};

export const updateRoom = async (
  req: Request<{ id: string }, {}, UpdateRoomDTO>,
  res: Response,
) => {
  const roomId = Number(req.params.id);

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { company: true },
    });

    if (!room || room.company.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await prisma.room.update({
      where: { id: roomId },
      data: req.body,
    });

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update room" });
  }
};

export const deleteRoom = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const roomId = Number(req.params.id);

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { company: true },
    });

    if (!room || room.company.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.room.delete({ where: { id: roomId } });

    res.json({ message: "Room deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete room" });
  }
};
