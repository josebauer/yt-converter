import { rateLimit } from "express-rate-limit";

import {
  getPositiveNumber
} from "../services/conversionLimitsService.js";

function createRateLimiter(
  windowMinutes: number,
  maxRequests: number,
  message: string
) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,

    limit: Math.max(
      1,
      Math.floor(maxRequests)
    ),

    standardHeaders: "draft-7",
    legacyHeaders: false,

    message: {
      success: false,
      message
    }
  });
}

export const conversionRateLimiter = createRateLimiter(
  getPositiveNumber(
    process.env.RATE_LIMIT_WINDOW_MINUTES, 15
  ),
  getPositiveNumber(
    process.env.RATE_LIMIT_MAX_REQUESTS, 5
  ),
  "Limite de conversões atingido. Tente novamente mais tarde."
);

export const infoRateLimiter = createRateLimiter(
  getPositiveNumber(
    process.env.INFO_RATE_LIMIT_WINDOW_MINUTES, 1
  ),
  getPositiveNumber(
    process.env.INFO_RATE_LIMIT_MAX, 15
  ),
  "Limite de consultas de vídeos atingido."
);

export const validateRateLimiter = createRateLimiter(
  getPositiveNumber(
    process.env.VALIDATE_RATE_LIMIT_WINDOW_MINUTES, 1
  ),
  getPositiveNumber(
    process.env.VALIDATE_RATE_LIMIT_MAX, 30
  ),
  "Limite de validações atingido."
);

export const statusRateLimiter = createRateLimiter(
  getPositiveNumber(
    process.env.STATUS_RATE_LIMIT_WINDOW_MINUTES, 1
  ),
  getPositiveNumber(
    process.env.STATUS_RATE_LIMIT_MAX, 120
  ),
  "Limite de consultas de status atingido."
);

export const downloadRateLimiter = createRateLimiter(
  getPositiveNumber(
    process.env.DOWNLOAD_RATE_LIMIT_WINDOW_MINUTES, 5
  ),
  getPositiveNumber(
    process.env.DOWNLOAD_RATE_LIMIT_MAX, 20
  ),
  "Limite de downloads atingido."
);
