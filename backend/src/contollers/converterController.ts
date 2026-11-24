import type { Request, Response } from "express";
import { converterSchema } from "../schemas/converterSchema.js";
import { z } from "zod";
import { getMediaInfo } from "../services/mediaService.js";
import { convertMedia } from "../services/converterService.js";

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

export async function convertVideo(
  req: Request,
  res: Response
): Promise<void> {
  const result = converterSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Dados inválidos.",
      errors: result.error.flatten()
    });
    return;
  }

  const { url, format } = result.data;

  const allowedUrl = process.env.ALLOWED_MEDIA_URL;

  if (!allowedUrl || url !== allowedUrl) {
    res.status(403).json({
      success: false,
      message: "Fonte de mídia não autorizada."
    });
    return;
  }

  try {
    const conversion = await convertMedia(url, format);

    res.status(200).json({
      success: true,
      message: "Conversão realizada com sucesso!",
      data: {
        id: conversion.id,
        filename: conversion.filename,
        format: format
      }
    });
  } catch (error) {
    console.error("Erro na conversão:", error);

    res.status(500).json({
      success: false,
      message: "Não foi possível realizar a conversão."
    });
  }
}