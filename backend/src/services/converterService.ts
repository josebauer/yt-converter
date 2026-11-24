import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";

export type OutputFormat = "mp3" | "mp4";

export interface ConversionResult {
  id: string;
  filename: string;
  outputPath: string;
}

export async function convertMedia(
  inputUrl: string,
  format: OutputFormat,
): Promise<ConversionResult> {
  const id = randomUUID();
  const filename = `${id}.${format}`;

  const tempDir = path.resolve("temp");
  const outputPath = path.join(tempDir, filename);

  await mkdir(tempDir, { recursive: true });

  const args =
    format === "mp3"
      ? [
          "-hide_banner",
          "-loglevel",
          "info",
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
        ]
      : [
          "-hide_banner",
          "-loglevel",
          "error",
          "-nostdin",
          "-y",
          "-i",
          inputUrl,
          "-c:v",
          "libx264",
          "-preset",
          "veryfast",
          "-c:a",
          "aac",
          "-movflags",
          "+faststart",
          outputPath,
        ];

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", args, {
      windowsHide: true,
      timeout: 600000,
    });

    let errorOutput = "";

    ffmpeg.stderr.on("data", (data) => {
      const message = data.toString();

      console.log(message);

      errorOutput = (errorOutput + message).slice(-4000);
    });

    ffmpeg.on("error", reject);

    ffmpeg.on("close", (code, signal) => {
      console.log("FFmpeg exit code:", code);
      console.log("FFmpeg signal:", signal);

      if (code === 0) {
        resolve({
          id,
          filename,
          outputPath,
        });
      } else {
        reject(
          new Error(
            `FFmpeg falhou (code: ${code}, signal: ${signal}): ${errorOutput}`,
          ),
        );
      }
    });
  });
}
