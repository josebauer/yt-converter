import { randomUUID } from "node:crypto";
import { stat, rm } from "node:fs/promises";
import { convertMedia } from "./converterService.js";
import { downloadYouTubeMedia } from "./youtubeService.js";
import { sanitizeFilename } from "../utils/sanitizeFilename.js";
import path from "node:path";

import {
  getPositiveNumber,
  tryStartConversion,
  finishConversion,
} from "./conversionLimitsService.js";

import type { ConversionJob } from "../types/conversionJob.js";
import type { OutputFormat } from "./converterService.js";

const jobs = new Map<string, ConversionJob>();

const queue: string[] = [];

export function addConversionJob(
  url: string,
  format: OutputFormat,
  title: string,
): ConversionJob | null {
  const maxQueueSize = Math.floor(
    getPositiveNumber(process.env.MAX_QUEUE_SIZE, 10),
  );

  if (queue.length >= maxQueueSize) {
    return null;
  }

  const job: ConversionJob = {
    id: randomUUID(),
    url,
    title,
    format,
    status: "queued",
    progress: 0,
    createdAt: Date.now(),
  };

  jobs.set(job.id, job);
  queue.push(job.id);

  console.log(`[Queue] Tarefa adicionada: ${job.id}`);

  processQueue();

  return job;
}

export function getConversionJob(id: string): ConversionJob | undefined {
  return jobs.get(id);
}

export function getQueuePosition(id: string): number {
  const index = queue.indexOf(id);

  return index === -1 ? 0 : index + 1;
}

function processQueue(): void {
  while (queue.length > 0) {
    if (!tryStartConversion()) {
      return;
    }

    const jobId = queue.shift();

    const job = jobId ? jobs.get(jobId) : undefined;

    if (!job) {
      finishConversion();
      continue;
    }

    void processJob(job);
  }
}

async function processJob(job: ConversionJob): Promise<void> {
  let sourcePath: string | undefined;
  let outputPath: string | undefined;

  job.startedAt = Date.now();

  try {
    job.status = "downloading";

    console.log(`[Queue] Baixando: ${job.id}`);

    sourcePath = await downloadYouTubeMedia(job.url, job.format, (progress) => {
      const overallProgress = Math.floor(progress * 0.49);

      job.progress = Math.max(job.progress, overallProgress);
    });

    const maxSize =
      getPositiveNumber(process.env.MAX_FILE_SIZE_MB, 200) * 1024 * 1024;

    const sourceStats = await stat(sourcePath);

    if (sourceStats.size > maxSize) {
      throw new Error("A mídia excede o tamanho máximo permitido.");
    }

    job.status = "converting";
    job.progress = 50;

    console.log(`[Queue] Convertendo: ${job.id}`);

    const conversion = await convertMedia(
      sourcePath,
      job.format,
      (progress) => {
        const overallProgress = 50 + Math.floor(progress * 0.49);

        job.progress = Math.max(job.progress, overallProgress);
      },
    );

    outputPath = conversion.outputPath;

    const outputStats = await stat(outputPath);

    if (outputStats.size > maxSize) {
      throw new Error("O arquivo convertido excede o tamanho máximo.");
    }

    const downloadFilename = `${sanitizeFilename(job.title)}.${job.format}`;

    job.result = {
      filename: conversion.filename,
      downloadFilename,
      downloadUrl: `/api/converter/download/${conversion.filename}`,
    };

    job.progress = 100;
    job.status = "completed";

    console.log(`[Queue] Concluída: ${job.id}`);
  } catch (error) {
    job.status = "failed";

    job.error = "Não foi possível concluir a conversão.";

    console.error(`[Queue] Erro: ${job.id}`, error);

    if (outputPath) {
      await rm(outputPath, { force: true }).catch(console.error);
    }
  } finally {
    job.finishedAt = Date.now();

    try {
      if (sourcePath) {
        await rm(path.dirname(sourcePath), {
          recursive: true,
          force: true,
        });
      }
    } catch (error) {
      console.error("[Queue] Erro na limpeza:", error);
    } finally {
      finishConversion();

      processQueue();
    }
  }
}

export function cleanupExpiredJobs(): void {
  const expirationTime = getPositiveNumber(
    process.env.JOB_EXPIRATION_MINUTES,
    60
  ) * 60 * 1000;

  const now = Date.now();

  for (const [id, job] of jobs) {
    if (
      (
        job.status === "expired" ||
        job.status === "failed"
      ) &&
      job.finishedAt !== undefined &&
      now - job.finishedAt >= expirationTime
    ) {
      jobs.delete(id);

      console.log(
        `[Queue] Tarefa removida: ${id}`
      );
    }
  }
}

export function getDownloadFilename(
  filename: string
): string | undefined {
  for (const job of jobs.values()) {
    if (
      job.status === "completed" &&
      job.result?.filename === filename
    ) {
      return job.result.downloadFilename;
    }
  }

  return undefined;
}

export function expireJobByFilename(filename: string): void {
  for (const job of jobs.values()) {
    if (job.status === "completed" && job.result?.filename === filename) {
      job.status = "expired";

      delete job.result;

      console.log(
        `[Queue] Arquivo da tarefa expirado: ${job.id}`
      );

      return;
    }
  }
}
