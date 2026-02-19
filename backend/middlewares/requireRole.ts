import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export const requireRole =
  (roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Akses ditolak" });
      return;
    }

    next();
  };
