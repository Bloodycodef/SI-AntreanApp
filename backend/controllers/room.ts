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

    if (!req.body.fields || req.body.fields.length === 0) {
      return res.status(400).json({
        message: "Room must have at least one field",
      });
    }

    const room = await prisma.$transaction(async (tx) => {
      const newRoom = await tx.room.create({
        data: {
          companyId: company.id,
          name: req.body.name,
          description: req.body.description,
          secretKey: crypto.randomBytes(4).toString("hex"),
          formFields: {
            create: req.body.fields.map((field) => ({
              label: field.label,
              type: field.type,
              required: field.required,
            })),
          },
        },
        include: {
          formFields: true,
        },
      });

      return newRoom;
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
export const getRooms = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user || req.user.role !== "company") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const rooms = await prisma.room.findMany({
      where: {
        company: {
          userId: req.user.id,
        },
      },
      include: {
        formFields: {
          orderBy: { order: "asc" },
        },
      },
    });

    return res.json(rooms);
  } catch (error) {
    console.error("GET ROOMS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch rooms",
    });
  }
};

export const updateRoom = async (
  req: Request<{ id: string }, {}, UpdateRoomDTO>,
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user || req.user.role !== "company") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const roomId = Number(req.params.id);

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        company: {
          userId: req.user.id,
        },
      },
      include: {
        formFields: true,
      },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const updatedRoom = await prisma.$transaction(async (tx) => {
      // Update basic info
      const updated = await tx.room.update({
        where: { id: roomId },
        data: {
          name: req.body.name,
          description: req.body.description,
        },
      });

      // If updating fields
      if (req.body.fields) {
        // Delete existing fields first (simplest safe approach)
        await tx.roomFormField.deleteMany({
          where: { roomId },
        });

        // Recreate fields
        await tx.roomFormField.createMany({
          data: req.body.fields.map((field, index) => ({
            roomId,
            label: field.label,
            type: field.type,
            required: field.required,
            order: field.order ?? index,
          })),
        });
      }

      return tx.room.findUnique({
        where: { id: roomId },
        include: { formFields: true },
      });
    });

    return res.json(updatedRoom);
  } catch (error) {
    console.error("UPDATE ROOM ERROR:", error);
    return res.status(500).json({
      message: "Failed to update room",
    });
  }
};

export const deleteRoom = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user || req.user.role !== "company") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const roomId = Number(req.params.id);

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        company: {
          userId: req.user.id,
        },
      },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    await prisma.room.delete({
      where: { id: roomId },
    });

    return res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("DELETE ROOM ERROR:", error);
    return res.status(500).json({
      message: "Failed to delete room",
    });
  }
};
