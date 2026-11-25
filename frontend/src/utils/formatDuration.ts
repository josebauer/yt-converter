export function formatDuration(
  totalSeconds: number
): string {
  if (
    !Number.isFinite(totalSeconds) ||
    totalSeconds < 0
  ) {
    return "--:--";
  }

  const duration = Math.floor(totalSeconds);

  const hours = Math.floor(duration / 3600);

  const minutes = Math.floor(
    (duration % 3600) / 60
  );

  const seconds = duration % 60;

  const formattedSeconds = String(seconds)
    .padStart(2, "0");

  if (hours > 0) {
    const formattedMinutes = String(minutes)
      .padStart(2, "0");

    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${minutes}:${formattedSeconds}`;
}