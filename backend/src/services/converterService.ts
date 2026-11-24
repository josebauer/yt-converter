import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { getMediaCodecs } from "./ffprobeService.js";
import { createLineReader } from "../utils/lineReader.js";

import type { ProgressCallback } from "../types/conversionJob.js";

export type OutputFormat = "mp3" | "mp4";

export interface ConversionResult {
  id: string;
  filename: string;
  outputPath: string;
}

export async function convertMedia(
  inputUrl: string,
  format: OutputFormat,
  onProgress?: ProgressCallback,
): Promise<ConversionResult> {
  const id = randomUUID();
  const filename = `${id}.${format}`;

  const tempDir = path.resolve("temp");
  const outputPath = path.join(tempDir, filename);

  await mkdir(tempDir, { recursive: true });

  const codecs = await getMediaCodecs(inputUrl);
  const durationInSeconds = codecs.durationInSeconds;

  let args: string[];

  if (format === "mp3") {
    args = [
      "-hide_banner",
      "-loglevel",
      "error",
      "-nostdin",
      "-y",
      "-i",
      inputUrl,
      "-vn",
      "-codec:a",
      "libmp3lame",
      "-b:a",
      "192k",
      outputPath,
    ];
  } else {
    console.log("Codecs originais:", codecs);

    if (!codecs.videoCodec) {
      throw new Error("O arquivo não possui uma faixa de vídeo.");
    }

    const copyVideo =
      codecs.videoCodec === "h264" && codecs.pixelFormat === "yuv420p";

    const copyAudio = codecs.audioCodec === "aac";

    console.log(
      "Processamento de vídeo:",
      copyVideo ? "Cópia" : "Recodificação",
    );

    console.log(
      "Processamento de áudio:",
      !codecs.audioCodec ? "Sem áudio" : copyAudio ? "Cópia" : "Recodificação",
    );

    args = [
      "-hide_banner",
      "-loglevel",
      "error",
      "-nostdin",
      "-y",
      "-i",
      inputUrl,

      "-map",
      "0:v:0",
      "-map",
      "0:a:0?",

      ...(copyVideo
        ? ["-c:v", "copy"]
        : ["-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p"]),

      ...(copyAudio ? ["-c:a", "copy"] : ["-c:a", "aac", "-b:a", "192k"]),

      "-movflags",
      "+faststart",
      outputPath,
    ];
  }

  args = ["-progress", "pipe:1", "-nostats", "-stats_period", "0.5", ...args];

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", args, {
      windowsHide: true,
      timeout: 600000,
    });

    let errorOutput = "";

    const readProgress = createLineReader((line) => {
      if (!line.startsWith("out_time_us=")) {
        return;
      }

      if (durationInSeconds <= 0) {
        return;
      }

      const microseconds = Number(line.split("=")[1]);

      if (!Number.isFinite(microseconds)) {
        return;
      }

      const processedSeconds = microseconds / 1000000;

      const progress = (processedSeconds / durationInSeconds) * 100;

      onProgress?.(Math.min(99, Math.max(0, progress)));
    });

    ffmpeg.stdout.setEncoding("utf8");
    ffmpeg.stderr.setEncoding("utf8");

    ffmpeg.stdout.on("data", (data: string) => {
      readProgress(data);
    });

    ffmpeg.stderr.on("data", (data: string) => {
      errorOutput = (errorOutput + data).slice(-4000);
    });

    ffmpeg.on("error", reject);

    ffmpeg.on("close", (code, signal) => {
      readProgress("\n");

      if (code === 0) {
        onProgress?.(100);

        resolve({
          id,
          filename,
          outputPath,
        });
      } else {
        reject(new Error(`FFmpeg falhou (${code}, ${signal}): ${errorOutput}`));
      }
    });
  });
}
