import type { CorsOptions } from "cors";

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ??
  "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const corsConfig: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(
      new Error("Origem não permitida pelo CORS.")
    );
  },

  methods: ["GET", "POST", "OPTIONS"],

  allowedHeaders: ["Content-Type"],

  exposedHeaders: [
    "Content-Disposition",
    "Content-Length",
    "RateLimit",
    "Retry-After"
  ],

  credentials: false,

  maxAge: 600
};
