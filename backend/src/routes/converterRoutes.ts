import { Router } from "express";
import { validateConverter } from "../contollers/converterController.js";

const router = Router();

router.post("/validate", validateConverter);

export default router