import { spawn } from "node:child_process";

interface MediaStream {
  codec_type: string;
  codec_name: string;
  pix_fmt?: string;
}

interface FFprobeResult {
  streams: MediaStream[];

  format?: {
    duration?: string;
  };
}

export interface MediaCodecs {
  videoCodec: string | null;
  audioCodec: string | null;
  pixelFormat: string | null;
  durationInSeconds: number;
}

export async function getMediaCodecs(inputPath: string): Promise<MediaCodecs> {
  const args = [
    "-v",
    "error",
    "-show_entries",
    "stream=codec_type,codec_name,pix_fmt:format=duration",
    "-of",
    "json",
    inputPath,
  ];

  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", args, {
      windowsHide: true,
      timeout: 30000,
    });

    let output = "";
    let errorOutput = "";

    ffprobe.stdout.setEncoding("utf8");
    ffprobe.stderr.setEncoding("utf8");

    ffprobe.stdout.on("data", (data) => {
      output += data;
    });

    ffprobe.stderr.on("data", (data) => {
      errorOutput = (errorOutput + data).slice(-4000);
    });

    ffprobe.on("error", reject);

    ffprobe.on("close", (code, signal) => {
      if (code !== 0) {
        reject(
          new Error(`FFprobe falhou (${code}, ${signal}): ${errorOutput}`),
        );
        return;
      }

      try {
        const result: FFprobeResult = JSON.parse(output);

        const video = result.streams.find(
          (stream) => stream.codec_type === "video",
        );

        const audio = result.streams.find(
          (stream) => stream.codec_type === "audio",
        );

        const duration = Number(result.format?.duration)

        resolve({
          videoCodec: video?.codec_name ?? null,
          audioCodec: audio?.codec_name ?? null,
          pixelFormat: video?.pix_fmt ?? null,

          durationInSeconds:
            Number.isFinite(duration) && duration > 0 ? duration : 0,
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}
