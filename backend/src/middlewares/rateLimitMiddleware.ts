
import { rateLimit } from "express-rate-limit";
import { getPositiveNumber } from "../services/conversionLimitsService.js";

export const conversionRateLimiter = rateLimit({
  windowMs: getPositiveNumber(
    process.env.RATE_LIMIT_WINDOW_MINUTES,
    15
  ) * 60 * 1000,

  limit: Math.max(
    1,
    Math.floor(
      getPositiveNumber(
        process.env.RATE_LIMIT_MAX_REQUESTS,
        5
      )
    )
  ),

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Limite de requisições atingido. Tente novamente mais tarde."
  }
});
