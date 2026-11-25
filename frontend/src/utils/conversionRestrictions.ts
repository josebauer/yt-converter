
import type { MediaInfo } from "@/types/converter";

const configuredLimit = Number(
  process.env.NEXT_PUBLIC_MAX_VIDEO_DURATION_MINUTES
);

export const MAX_VIDEO_DURATION_MINUTES =
  Number.isFinite(configuredLimit) && configuredLimit > 0
    ? configuredLimit
    : 20;

export function getConversionRestriction(
  video: MediaInfo
): string | null {
  if (video.liveBroadcastContent === "live") {
    return "Não é possível converter transmissões ao vivo.";
  }

  if (video.liveBroadcastContent === "upcoming") {
    return "Não é possível converter transmissões agendadas.";
  }

  if (
    !Number.isFinite(video.durationInSeconds) ||
    video.durationInSeconds <= 0
  ) {
    return "Não foi possível identificar a duração do vídeo.";
  }

  if (
    video.durationInSeconds >
    MAX_VIDEO_DURATION_MINUTES * 60
  ) {
    return `O vídeo excede o limite de ${MAX_VIDEO_DURATION_MINUTES} minutos.`;
  }

  return null;
}