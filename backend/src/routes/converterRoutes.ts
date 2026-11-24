import { Router } from "express";
import { convertVideo, downloadVideo, getVideoInfo, validateConverter } from "../contollers/converterController.js";

const router = Router();

router.post("/validate", validateConverter)
router.post("/info", getVideoInfo)
router.post("/convert", convertVideo)
router.get("/download/:filename", downloadVideo)

export default router