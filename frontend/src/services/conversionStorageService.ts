import type {
  MediaInfo,
  OutputFormat,
  ConversionJob,
} from "@/types/converter";

const STORAGE_KEY = "yt-converter:active-conversion";

interface StoredConversion {
  video: MediaInfo;
  format: OutputFormat;
  job: ConversionJob;
}

export function saveConversion(
  conversion: StoredConversion
): void {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(conversion)
    );
  } catch (error) {
    console.error(
      "Erro ao armazenar conversão:",
      error
    );
  }
}

export function getStoredConversion():
  StoredConversion | null {
  try {
    const stored = sessionStorage.getItem(
      STORAGE_KEY
    );

    if (!stored) return null;

    const conversion = JSON.parse(
      stored
    ) as StoredConversion;

    if (
      !conversion.video?.url ||
      !conversion.job?.id ||
      !["mp3", "mp4"].includes(conversion.format)
    ) {
      clearStoredConversion();

      return null;
    }

    return conversion;
  } catch {
    clearStoredConversion();

    return null;
  }
}

export function clearStoredConversion(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error(
      "Erro ao limpar conversão:",
      error
    );
  }
}