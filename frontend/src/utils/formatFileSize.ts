export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "Tamanho indisponível";
  }

  const units = ["B", "KB", "MB", "GB"];

  let size = bytes;
  let unitIndex = 0;

  while (
    size >= 1024 &&
    unitIndex < units.length - 1
  ) {
    size /= 1024;
    unitIndex++;
  }

  const formattedSize = size.toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  });

  return `${formattedSize} ${units[unitIndex]}`;
}