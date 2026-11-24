import type { Request, Response } from "express";
import { converterSchema } from "../schemas/converterSchema.js";
import { z } from "zod";
import { getMediaInfo } from "../services/mediaService.js";

const mediaInfoSchema = z.object({
  url: z.url()
});

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

export async function getVideoInfo(
  req: Request,
  res: Response
): Promise<void> {
  const result = mediaInfoSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "URL inválida.",
      errors: result.error.flatten()
    });
    return;
  }

  try {
    const media = await getMediaInfo(result.data.url);

    res.status(200).json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error("Erro ao consultar vídeo:", error);

    if (
      error instanceof Error &&
      (
        error.message === "URL do YouTube inválida." ||
        error.message === "Vídeo não encontrado ou indisponível."
      )
    ) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(502).json({
      success: false,
      message: "Não foi possível consultar as informações do vídeo."
    });
  }
}