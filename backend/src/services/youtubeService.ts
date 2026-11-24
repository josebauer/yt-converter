import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { extractVideoId } from "./mediaService.js";
import type { OutputFormat } from "./converterService.js";

export async function downloadYouTubeMedia(
  url: string,
  format: OutputFormat
): Promise<string> {
  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new Error("URL do YouTube inválida.");
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const id = randomUUID();
  const tempDir = path.resolve("temp", "source", id);

  await mkdir(tempDir, { recursive: true });

  const outputTemplate = path.join(
    tempDir,
    "%(id)s.%(ext)s"
  );

  const args = [
    "--ignore-config",
    "--encoding", "utf-8",
    "--no-playlist",
    "--no-progress",
    "--no-warnings",
    "--max-filesize", "200M",
    "--socket-timeout", "30",
    "--retries", "2",
    "-f", format === "mp3"
      ? "bestaudio/best"
      : "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
    "--merge-output-format", "mp4",
    "--print", "after_move:filepath",
    "--no-simulate",
    "-o", outputTemplate,
    "--",
    videoUrl
  ];

  try {
    return await new Promise<string>((resolve, reject) => {
      const ytDlp = spawn("yt-dlp", args, {
        windowsHide: true,
        timeout: 180000
      });

      let output = "";
      let errorOutput = "";

      ytDlp.stdout.setEncoding("utf8");

      ytDlp.stdout.on("data", (data) => {
        output += data;
      });

      ytDlp.stderr.on("data", (data) => {
        errorOutput = (
          errorOutput + data.toString()
        ).slice(-4000);
      });

      ytDlp.on("error", reject);

      ytDlp.on("close", (code) => {
        const filePath = output
          .trim()
          .split(/\r?\n/)
          .pop();

        if (code === 0 && filePath) {
          resolve(filePath);
        } else {
          reject(
            new Error(`yt-dlp falhou: ${errorOutput}`)
          );
        }
      });
    });
  } catch (error) {
    await rm(tempDir, {
      recursive: true,
      force: true
    });

    throw error;
  }
}
