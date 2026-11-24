import { Router } from "express";
import { convertVideo, getVideoInfo, validateConverter } from "../contollers/converterController.js";

const router = Router();

router.post("/validate", validateConverter)
router.post("/info", getVideoInfo)
router.post("/convert", convertVideo)

export default router