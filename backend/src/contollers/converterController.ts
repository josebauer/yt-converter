import type { Request, Response } from "express";
import { converterSchema } from "../schemas/converterSchema.js";

export function validateConverter(req: Request, res: Response) {
  const result = converterSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Dados inválidos",
      errors: result.error.flatten()
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Requisição validada com sucesso",
    data: result.data
  });
}