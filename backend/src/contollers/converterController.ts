import type { Request, Response } from "express";
import { converterSchema } from "../schemas/converterSchema.js";
import { z } from "zod";
import { getMediaInfo } from "../services/mediaService.js";
import { convertMedia } from "../services/converterService.js";
import { getDownloadFile } from "../services/donwloadService.js";
import { downloadSchema } from "../schemas/converterSchema.js";
import { downloadYouTubeMedia } from "../services/youtubeService.js";
import { rm } from "node:fs/promises";
import path from "node:path";

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

  let sourcePath: string | undefined;

  try {
    sourcePath = await downloadYouTubeMedia(url, format);

    const conversion = await convertMedia(
      sourcePath,
      format
    );

    res.status(200).json({
      success: true,
      message: "Conversão realizada com sucesso!",
      data: {
        id: conversion.id,
        filename: conversion.filename,
        format,
        downloadUrl:
          `/api/converter/download/${conversion.filename}`
      }
    });
  } catch (error) {
    console.error("Erro na conversão:", error);

    res.status(500).json({
      success: false,
      message: "Não foi possível realizar a conversão."
    });
  } finally {
    if (sourcePath) {
      await rm(path.dirname(sourcePath), {
        recursive: true,
        force: true
      }).catch((error) => {
        console.error("Erro ao excluir mídia original:", error);
      });
    }
  }
}

export async function downloadVideo(
  req: Request,
  res: Response
): Promise<void> {
  const result = downloadSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Nome de arquivo inválido."
    });
    return;
  }

  try {
    const { filename } = result.data;

    const file = await getDownloadFile(filename);

    if (!file) {
      res.status(404).json({
        success: false,
        message: "Arquivo não encontrado."
      });
      return;
    }

    res.download(file.filePath, file.filename, (error) => {
      if (error) {
        console.error("Erro no download:", error);

        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Não foi possível baixar o arquivo."
          });
        } else {
          res.destroy();
        }
      }
    });
  } catch (error) {
    console.error("Erro no download:", error);

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}
