import { readdir, stat, unlink, mkdir } from "node:fs/promises";
import { cleanupExpiredJobs } from "./conversionQueueService.js";
import path from "node:path";

const tempDir = path.resolve("temp");

const convertedFilePattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(mp3|mp4)$/i;

function getMinutes(value: string | undefined, fallback: number) {
  const minutes = Number(value);

  return Number.isFinite(minutes) && minutes > 0 ? minutes : fallback;
}

let isCleaning = false;

export async function cleanupExpiredFiles(): Promise<void> {
  if (isCleaning) return;

  isCleaning = true;

  try {
    await mkdir(tempDir, { recursive: true });

    const expirationTime =
      getMinutes(process.env.FILE_EXPIRATION_MINUTES, 30) * 60 * 1000;

    const files = await readdir(tempDir, {
      withFileTypes: true,
    });

    const now = Date.now();

    let removedFiles = 0;

    for (const file of files) {
      if (!file.isFile()) continue;

      if (!convertedFilePattern.test(file.name)) continue;

      const filePath = path.join(tempDir, file.name);

      try {
        const fileStats = await stat(filePath);

        const fileAge = now - fileStats.mtimeMs;

        if (fileAge >= expirationTime) {
          await unlink(filePath);

          removedFiles++;

          console.log(`[Cleanup] Arquivo removido: ${file.name}`);
        }
      } catch (error) {
        console.error(`[Cleanup] Erro ao processar ${file.name}:`, error);
      }
    }

    if (removedFiles > 0) {
      console.log(`[Cleanup] ${removedFiles} arquivo(s) removido(s).`);
    }
  } catch (error) {
    console.error("[Cleanup] Erro na limpeza:", error);
  } finally {
    isCleaning = false;
  }
}

export function startCleanupService() {
  const interval =
    getMinutes(
      process.env.CLEANUP_INTERVAL_MINUTES,
      5
    ) * 60 * 1000;

  console.log("[Cleanup] Serviço de limpeza iniciado.");

  void cleanupExpiredFiles();
  cleanupExpiredJobs();

  return setInterval(() => {
    void cleanupExpiredFiles();
    cleanupExpiredJobs();
  }, interval);
}

