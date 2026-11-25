import path from "node:path";

const activeFiles = new Map<string, number>();

const deletingFiles = new Set<string>();

function normalizePath(filePath: string): string {
  const resolvedPath = path.resolve(filePath);

  return process.platform === "win32"
    ? resolvedPath.toLowerCase()
    : resolvedPath;
}

export function lockFile(filePath: string): boolean {
  const key = normalizePath(filePath);

  if (deletingFiles.has(key)) {
    return false;
  }

  const currentCount = activeFiles.get(key) ?? 0;

  activeFiles.set(key, currentCount + 1);

  return true;
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

export function tryStartFileDeletion(
  filePath: string
): boolean {
  const key = normalizePath(filePath);

  if (
    activeFiles.has(key) ||
    deletingFiles.has(key)
  ) {
    return false;
  }

  deletingFiles.add(key);

  return true;
}

export function finishFileDeletion(
  filePath: string
): void {
  const key = normalizePath(filePath);

  deletingFiles.delete(key);
}
