import express from "express";
import cors from "cors";
import helmet from "helmet";
import { corsConfig } from "./config/corsConfig.js";
import converterRoutes from "./routes/converterRoutes.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

app.disable("x-powerd-by");

app.use(helmet());

app.use(cors(corsConfig))

app.use(express.json({
  limit: "10kb"
}));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "YT Converter API"
  });
});

app.use("/api/converter", converterRoutes);

app.use(notFoundMiddleware)

app.use(errorMiddleware)

export default app;