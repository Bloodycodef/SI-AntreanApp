// src/index.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:3000", // frontend
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */
app.use("/auth", authRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (_req, res) => {
  res.json({ message: "API running" });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
