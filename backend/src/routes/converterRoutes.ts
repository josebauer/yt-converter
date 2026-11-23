import { Router } from "express";
import { testConverter } from "../contollers/converterController.js";

const router = Router();

router.get("/test", testConverter);

export default router;
