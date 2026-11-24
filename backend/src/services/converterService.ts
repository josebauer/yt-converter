import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { getMediaCodecs } from "./ffprobeService.js";

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
    const codecs = await getMediaCodecs(inputUrl);

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
