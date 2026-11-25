import path from "node:path";

const activeFiles = new Map<string, number>();

function normalizePath(filePath: string): string {
  const resolvedPath = path.resolve(filePath);

  return process.platform === "win32"
    ? resolvedPath.toLowerCase()
    : resolvedPath;
}

export function lockFile(filePath: string): void {
  const key = normalizePath(filePath);

  const currentCount = activeFiles.get(key) ?? 0;

  activeFiles.set(key, currentCount + 1);
}

export function unlockFile(filePath: string): void {
  const key = normalizePath(filePath);

  const currentCount = activeFiles.get(key) ?? 0;

  if (currentCount <= 1) {
    activeFiles.delete(key);
  } else {
    activeFiles.set(key, currentCount - 1);
  }
}

export function isFileInUse(filePath: string): boolean {
  const key = normalizePath(filePath);

  return activeFiles.has(key);
}