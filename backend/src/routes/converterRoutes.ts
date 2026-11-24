import { Router } from "express";
import { convertVideo, downloadVideo, getConversionStatus, getVideoInfo, validateConverter } from "../contollers/converterController.js";
import { conversionRateLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = Router();

router.post("/validate", validateConverter)
router.post("/info", getVideoInfo)
router.post("/convert", conversionRateLimiter, convertVideo)
router.get("/download/:filename", downloadVideo)
router.get("/status/:id", getConversionStatus)

export default router