import { Router } from "express";
import {
  convertVideo,
  downloadVideo,
  getConversionStatus,
  getVideoInfo,
  validateConverter,
} from "../contollers/converterController.js";
import {
  conversionRateLimiter,
  infoRateLimiter,
  validateRateLimiter,
  statusRateLimiter,
  downloadRateLimiter,
} from "../middlewares/rateLimitMiddleware.js";

const router = Router();

router.post("/validate", validateRateLimiter, validateConverter);
router.post("/info", infoRateLimiter, getVideoInfo);
router.post("/convert", conversionRateLimiter, convertVideo);
router.get("/download/:filename", downloadRateLimiter, downloadVideo);
router.get("/status/:id", statusRateLimiter, getConversionStatus);

export default router;
