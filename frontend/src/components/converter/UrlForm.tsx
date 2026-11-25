"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Link2,
  Search,
  LoaderCircle,
} from "lucide-react";

import {
  urlSchema,
  type UrlFormInput,
} from "@/schemas/converterSchema";

interface Props {
  onSearch: (url: string) => Promise<void>;
  isLoading: boolean;
}

export default function UrlForm({
  onSearch,
  isLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UrlFormInput>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const isBusy = isLoading || isSubmitting;

  async function onSubmit(data: UrlFormInput) {
    await onSearch(data.url);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
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
            {...register("url")}
            id="video-url"
            type="url"
            placeholder="Cole o link do YouTube aqui..."
            autoComplete="off"
            readOnly={isBusy}
            aria-invalid={!!errors.url}
            aria-describedby={
              errors.url ? "url-error" : "url-hint"
            }
            className={`h-13 w-full rounded-xl border bg-background pr-4 pl-12 text-sm text-foreground transition-colors outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-primary/20 ${
              errors.url
                ? "border-error"
                : "border-border focus:border-primary"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary-hover px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {isBusy ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
                aria-hidden="true"
              />
              Buscando...
            </>
          ) : (
            <>
              <Search
                size={18}
                aria-hidden="true"
              />
              Buscar vídeo
            </>
          )}
        </button>
      </div>

      {errors.url && (
        <p
          id="url-error"
          role="alert"
          className="mt-2 text-sm text-error"
        >
          {errors.url.message}
        </p>
      )}

      <p
        id="url-hint"
        className="mt-4 text-xs leading-relaxed text-muted"
      >
        Suporta links de vídeos do YouTube.
        Duração máxima de 20 minutos.
      </p>
    </form>
  );
}