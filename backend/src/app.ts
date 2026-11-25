import express from "express";
import cors from "cors";
import helmet from "helmet";
import { corsConfig } from "./config/corsConfig.js";
import converterRoutes from "./routes/converterRoutes.js";

const app = express();

app.disable("x-powerd-by");

app.use(helmet());

app.use(cors(corsConfig))

app.use(express.json({
  limit: "10kb"
}));

app.use("/api/converter", converterRoutes);

export default app;