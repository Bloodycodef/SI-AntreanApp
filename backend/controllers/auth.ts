import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../config/prisma";
import { RegisterRequestBody } from "../types/auth";
import { sendVerificationEmail } from "../utils/verificationEmail";

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
