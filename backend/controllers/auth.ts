import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma";
import { RegisterRequestBody, LoginRequestBody } from "../types/index";
import { sendVerificationEmail } from "../utils/verificationEmail";
import { JwtPayload } from "../types/index";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

//REGISTER NEW USER
export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response,
): Promise<Response> => {
  try {
    const {
      email,
      password,
      role,
      fullName,
      phone,
      companyName,
      industry,
      website,
      address,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Data wajib lengkap" });
    }

    if (role === "user" && !fullName) {
      return res.status(400).json({ message: "fullname wajib diisi" });
    }

    if (role === "company" && !companyName) {
      return res.status(400).json({ message: "company name wajib di isi!" });
    }

    const emailAda = await prisma.user.findUnique({
      where: { email },
    });

    if (emailAda) {
      return res
        .status(409)
        .json({ message: "email sudah digunakaan atau sudah ada" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const { user, token } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashPassword,
          role,
        },
      });

      if (role === "user") {
        await tx.userProfile.create({
          data: {
            userId: user.id,
            fullName: fullName!,
            phone,
          },
        });
      }

      if (role === "company") {
        await tx.company.create({
          data: {
            userId: user.id,
            companyName: companyName!,
            industry,
            website,
            address,
          },
        });
      }

      const token = crypto.randomBytes(32).toString("hex");

      await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      return { user, token };
    });

    await sendVerificationEmail(user.email, token);

    return res.status(201).json({
      message: "register berhasil silahkan cek email ",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isVerified) {
    return res.status(401).json({ message: "Email atau password salah" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Email atau password salah" });
  }

  const payload: JwtPayload = {
    userId: String(user.id),
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { userId: String(user.id) },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" },
  );

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Login berhasil",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

export const logout = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return res.status(200).json({ message: "Logout berhasil" });
    }

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await prisma.refreshToken.deleteMany({
      where: { token: hashedRefreshToken },
    });

    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      message: "logout berhasil",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    res.status(400).json({ message: "Token tidak valid" });
    return;
  }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record) {
    res.status(400).json({ message: "Token tidak ditemukan" });
    return;
  }

  if (record.expiresAt < new Date()) {
    res.status(400).json({ message: "Token sudah kadaluarsa" });
    return;
  }

  // ✅ update user
  await prisma.user.update({
    where: { id: record.userId },
    data: { isVerified: true },
  });

  // ✅ hapus token setelah dipakai
  await prisma.emailVerificationToken.delete({
    where: { userId: record.userId },
  });

  res.status(200).json({
    message: "Email berhasil diverifikasi",
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
    userId: string;
  };

  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const stored = await prisma.refreshToken.findFirst({
    where: { userId: Number(payload.userId), token: hashed },
  });

  if (!stored || stored.expiresAt < new Date()) {
    return res.status(401).json({ message: "Refresh token invalid" });
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const newPayload: JwtPayload = {
    userId: payload.userId,
    role: "user", // bisa fetch ulang kalau perlu
  };

  const newAccessToken = jwt.sign(newPayload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m",
  });

  res.cookie("access_token", newAccessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });

  return res.json({ message: "Token refreshed" });
};
