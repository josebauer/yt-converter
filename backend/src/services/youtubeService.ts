import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, rm } from "node:fs/promises";
import { extractVideoId } from "./mediaService.js";
import type { OutputFormat } from "./converterService.js";
import { getPositiveNumber } from "./conversionLimitsService.js";
import type { ProgressCallback } from "../types/conversionJob.js";
import { createLineReader } from "../utils/lineReader.js";
import path from "node:path";

export async function downloadYouTubeMedia(
  url: string,
  format: OutputFormat,
  onProgress?: ProgressCallback,
): Promise<string> {
  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new Error("URL do YouTube inválida.");
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const id = randomUUID();
  const tempDir = path.resolve("temp", "source", id);

  await mkdir(tempDir, { recursive: true });

  const outputTemplate = path.join(tempDir, "%(id)s.%(ext)s");

  const maxFileSize = getPositiveNumber(process.env.MAX_FILE_SIZE_MB, 200);

  const args = [
    "--ignore-config",
    "--encoding",
    "utf-8",
    "--js-runtimes",
    "node",
    "--no-playlist",
    "--progress",
    "--newline",
    "--progress-template",
    "download:PROGRESS:%(progress._percent_str)s",
    "--no-warnings",
    "--max-filesize",
    `${maxFileSize}M`,
    "--match-filter",
    "!is_live & !is_upcoming",
    "--socket-timeout",
    "30",
    "--retries",
    "2",
    "-f",
    format === "mp3"
      ? "bestaudio/best"
      : [
          "bestvideo[height<=1080][vcodec^=avc1]+bestaudio[acodec^=mp4a]",
          "best[height<=1080][vcodec^=avc1][acodec^=mp4a]",
          "bestvideo[height<=1080]+bestaudio",
          "best[height<=1080]",
        ].join("/"),
    "--merge-output-format",
    "mp4",
    "--print",
    "after_move:FILEPATH:%(filepath)s",
    "--no-simulate",
    "-o",
    outputTemplate,
    "--",
    videoUrl,
  ];

  try {
    return await new Promise<string>((resolve, reject) => {
      const ytDlp = spawn("yt-dlp", args, {
        windowsHide: true,
        timeout: 180000,
      });

      let filePath: string | undefined;
      let errorOutput = "";

      const handleLine = (line: string) => {
        if (line.startsWith("PROGRESS:")) {
          const match = line.match(/PROGRESS:\s*(\d+(?:\.\d+)?)%/);

          if (match) {
            const progress = Number(match[1]);

            if (Number.isFinite(progress)) {
              onProgress?.(Math.min(100, Math.max(0, progress)));
            }
          }
        }

        if (line.startsWith("FILEPATH:")) {
          filePath = line.slice("FILEPATH:".length).trim();
        }
      };

      const readStdout = createLineReader(handleLine);
      const readStderr = createLineReader(handleLine);

      ytDlp.stdout.setEncoding("utf8");
      ytDlp.stderr.setEncoding("utf8");

      ytDlp.stdout.on("data", (data: string) => {
        readStdout(data);
      });

      ytDlp.stderr.on("data", (data: string) => {
        readStderr(data);

        errorOutput = (errorOutput + data).slice(-4000);
      });

      ytDlp.on("error", reject);

      ytDlp.on("close", (code, signal) => {
        // Processar eventuais linhas restantes
        readStdout("\n");
        readStderr("\n");

        if (code === 0 && filePath) {
          onProgress?.(100);

          resolve(filePath);
        } else {
          reject(
            new Error(`yt-dlp falhou (${code}, ${signal}): ${errorOutput}`),
          );
        }
      });
    });
  } catch (error) {
    await rm(tempDir, {
      recursive: true,
      force: true,
    });

    throw error;
  }
}
