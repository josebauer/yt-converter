let activeConversions = 0;

export function getPositiveNumber(
  value: string | undefined,
  fallback: number
): number {
  const number = Number(value);

  return Number.isFinite(number) && number > 0
    ? number
    : fallback;
}

export function getMaxConcurrentConversions(): number {
  return Math.max(
    1,
    Math.floor(
      getPositiveNumber(
        process.env.MAX_CONCURRENT_CONVERSIONS,
        2
      )
    )
  );
}

export function getActiveConversions(): number {
  return activeConversions;
}

export function tryStartConversion(): boolean {
  if (activeConversions >= getMaxConcurrentConversions()) {
    return false;
  }

  activeConversions++;

  console.log(
    `[Conversion] Conversões ativas: ${activeConversions}`
  );

  return true;
}

export function finishConversion(): void {
  activeConversions = Math.max(0, activeConversions - 1);

  console.log(
    `[Conversion] Conversões ativas: ${activeConversions}`
  );
}

export function parseDuration(duration: string): number {
  const match = duration.match(
    /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
  );

  if (!match) {
    throw new Error("Duração do vídeo inválida.");
  }

  const days = Number(match[1] || 0);
  const hours = Number(match[2] || 0);
  const minutes = Number(match[3] || 0);
  const seconds = Number(match[4] || 0);

  return (
    days * 86400 +
    hours * 3600 +
    minutes * 60 +
    seconds
  );
}

export function isDurationAllowed(
  durationInSeconds: number
): boolean {
  const maxDuration = getPositiveNumber(
    process.env.MAX_VIDEO_DURATION_MINUTES,
    20
  ) * 60;

  return (
    Number.isFinite(durationInSeconds) &&
    durationInSeconds > 0 &&
    durationInSeconds <= maxDuration
  );
}