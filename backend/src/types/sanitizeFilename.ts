export function sanitizeFilename(title: string): string {
  let filename = title
    .normalize("NFC")
    .replace(/[<>:"/\\|?*\x00-\x1F\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 150)
    .replace(/[. ]+$/g, "");

  const reservedNames =
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i;

  if (reservedNames.test(filename)) {
    filename = `_${filename}`;
  }

  return filename || "video";
}