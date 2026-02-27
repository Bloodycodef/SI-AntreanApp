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
    origin: "http://localhost:3000", // frontend
    credentials: true,
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
  res.json({ message: "API running" });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("server sudah berjalan baby");
});
