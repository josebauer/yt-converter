import path from "node:path";
import { stat } from "node:fs/promises";
import { lockFile, unlockFile } from "./fileUsageService.js";

export async function getDownloadFile(filename: string) {
  const tempDir = path.resolve("temp");

  const filePath = path.join(tempDir, filename);

  if (!lockFile(filePath)) {
    return null;
  }

  try {
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      unlockFile(filePath);
      return null;
    }

    return {
      filePath,
      filename,
      size: fileStats.size,
    };
  } catch (error) {
    unlockFile(filePath);

    return null;
  }
}
