import { Router } from "express";
import { getVideoInfo, validateConverter } from "../contollers/converterController.js";

const router = Router();

router.post("/validate", validateConverter)
router.post("/info", getVideoInfo)

export default router