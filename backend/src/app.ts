import express from "express";
import cors from "cors";
import converterRoutes from "./routes/converterRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

app.use(express.json());

app.use("/api/converter", converterRoutes);

export default app;