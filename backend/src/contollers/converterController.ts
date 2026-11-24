import type { Request, Response } from "express";
import { converterSchema } from "../schemas/converterSchema.js";
import { z } from "zod";
import { getMediaInfo } from "../services/mediaService.js";
import { getDownloadFile } from "../services/donwloadService.js";
import { downloadSchema } from "../schemas/converterSchema.js";
import { conversionJobSchema } from "../schemas/conversionJobSchema.js";

import {
  addConversionJob,
  getConversionJob,
  getQueuePosition,
  getDownloadFilename,
} from "../services/conversionQueueService.js";

import {
  isDurationAllowed,
  getPositiveNumber,
} from "../services/conversionLimitsService.js";

const mediaInfoSchema = z.object({
  url: z.url(),
});

export function validateConverter(req: Request, res: Response) {
  const result = converterSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Dados inválidos",
      errors: result.error.flatten(),
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Requisição validada com sucesso",
    data: result.data,
  });
}

export async function getVideoInfo(req: Request, res: Response): Promise<void> {
  const result = mediaInfoSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "URL inválida.",
      errors: result.error.flatten(),
    });
    return;
  }

  try {
    const media = await getMediaInfo(result.data.url);

    res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error("Erro ao consultar vídeo:", error);

    if (
      error instanceof Error &&
      (error.message === "URL do YouTube inválida." ||
        error.message === "Vídeo não encontrado ou indisponível.")
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(502).json({
      success: false,
      message: "Não foi possível consultar as informações do vídeo.",
    });
  }
}

export async function convertVideo(req: Request, res: Response): Promise<void> {
  const result = converterSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Dados inválidos.",
      errors: result.error.flatten(),
    });
    return;
  }

  const { url, format } = result.data;

  try {
    const mediaInfo = await getMediaInfo(url);

    if (mediaInfo.liveBroadcastContent !== "none") {
      res.status(422).json({
        success: false,
        message: "Transmissões ao vivo não são permitidas.",
      });
      return;
    }

    if (!isDurationAllowed(mediaInfo.durationInSeconds)) {
      const maxDuration = getPositiveNumber(
        process.env.MAX_VIDEO_DURATION_MINUTES,
        20,
      );

      res.status(422).json({
        success: false,
        message: `O vídeo deve possuir no máximo ${maxDuration} minutos.`,
      });
      return;
    }

    const job = addConversionJob(url, format, mediaInfo.title);

    if (!job) {
      res.status(503).json({
        success: false,
        message: "Fila de conversões cheia. Tente novamente mais tarde.",
      });
      return;
    }

    res.status(202).json({
      success: true,
      message: "Solicitação de conversão aceita.",
      data: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        queuePosition: getQueuePosition(job.id),
        statusUrl: `/api/converter/status/${job.id}`,
      },
    });
  } catch (error) {
    console.error("Erro ao solicitar conversão:", error);

    res.status(500).json({
      success: false,
      message: "Não foi possível solicitar a conversão.",
    });
  }
}

export async function downloadVideo(
  req: Request,
  res: Response,
): Promise<void> {
  const result = downloadSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Nome de arquivo inválido.",
    });
    return;
  }

  try {
    const { filename } = result.data;

    const file = await getDownloadFile(filename);

    if (!file) {
      res.status(404).json({
        success: false,
        message: "Arquivo não encontrado.",
      });
      return;
    }

    const downloadFilename = getDownloadFilename(file.filename) ?? file.filename;

    res.download(file.filePath, downloadFilename, (error) => {
      if (error) {
        console.error("Erro no download:", error);

        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Não foi possível baixar o arquivo.",
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
      message: "Erro interno do servidor.",
    });
  }
}

export function getConversionStatus(req: Request, res: Response): void {
  const result = conversionJobSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Identificador inválido.",
    });
    return;
  }

  const job = getConversionJob(result.data.id);

  if (!job) {
    res.status(404).json({
      success: false,
      message: "Conversão não encontrada ou expirada.",
    });
    return;
  }

  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    success: true,
    data: {
      id: job.id,
      format: job.format,
      status: job.status,
      progress: job.progress,
      queuePosition: getQueuePosition(job.id),
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      finishedAt: job.finishedAt,
      result: job.result,
      error: job.error,
    },
  });
}
