import express from "express";
import cors from "cors";
import helmet from "helmet";
import converterRoutes from "./routes/converterRoutes.js";

const app = express();

app.use(helmet());

app.disable("x-powerd-by");

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

app.use(express.json());

app.use("/api/converter", converterRoutes);

export default app;