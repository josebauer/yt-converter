
import { Link2, Search } from "lucide-react";

export default function Converter() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 text-left shadow-2xl shadow-black/20 sm:p-7">
      <label
        htmlFor="video-url"
        className="mb-3 block text-sm font-medium"
      >
        URL do vídeo
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Link2
            size={20}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
          />

          <input
            id="video-url"
            name="url"
            type="url"
            placeholder="Cole o link do YouTube aqui..."
            autoComplete="off"
            className="h-13 w-full rounded-xl border border-border bg-background pr-4 pl-12 text-sm text-foreground transition-colors outline-none placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="button"
          disabled
          className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary-hover px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          <Search size={18} aria-hidden="true" />
          Buscar vídeo
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Suporta links de vídeos do YouTube.
        Duração máxima de 20 minutos.
      </p>
    </div>
  );
}
