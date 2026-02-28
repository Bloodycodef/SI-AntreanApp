// src/index.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/room";
import transactionRoutes from "./routes/transaction";
import queueRoutes from "./routes/joinQueue";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/queue", queueRoutes);
app.use("/transactions", transactionRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (_req, res) => {
  res.json({ message: "API running, berhasil terhubugn" });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("server sudah berjalan baby");
});
