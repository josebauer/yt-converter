import path from "node:path";
import { stat } from "node:fs/promises";

export async function getDownloadFile(filename: string) {
  const tempDir = path.resolve("temp");
  const filePath = path.join(tempDir, filename);

  try {
    const file = await stat(filePath);

    if (!file.isFile()) {
      return null;
    }

    return {
      filename,
      filePath,
      size: file.size
    };
  } catch {
    return null;
  }
}
