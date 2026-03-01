import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/index";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      res.status(401).json({ message: "Unauthorized: token tidak ditemukan" });
      return;
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;

    req.user = {
      id: Number(decoded.userId), //
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: token tidak valid" });
  }
};
