
import {
  Music2,
  Video,
  CheckCircle2,
} from "lucide-react";

import type { OutputFormat } from "@/types/converter";

interface Props {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  disabled?: boolean;
}

const formats = [
  {
    value: "mp3",
    title: "MP3",
    description: "Áudio · 192 kbps",
    icon: Music2,
  },
  {
    value: "mp4",
    title: "MP4",
    description: "Vídeo · Até 1080p",
    icon: Video,
  },
] as const;

export default function FormatSelector({
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-3 text-sm font-medium">
        Escolha o formato
      </legend>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {formats.map((format) => {
          const isSelected = value === format.value;

          return (
            <label
              key={format.value}
              className={`relative flex items-center gap-3 rounded-xl border p-4 transition-colors ${disabled
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
                } ${isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-primary/40"
                }`}
            >
              <input
                type="radio"
                name="output-format"
                value={format.value}
                checked={isSelected}
                onChange={() => onChange(format.value)}
                className="peer sr-only"
              />

              <span className="pointer-events-none absolute inset-0 rounded-xl peer-focus-visible:ring-2 peer-focus-visible:ring-primary" />

              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <format.icon
                  size={23}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {format.title}
                </p>

                <p className="mt-1 text-xs text-muted">
                  {format.description}
                </p>
              </div>

              {isSelected && (
                <CheckCircle2
                  size={19}
                  className="shrink-0 text-primary"
                  aria-hidden="true"
                />
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}