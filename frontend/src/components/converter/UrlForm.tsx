"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Link2,
  Search,
  LoaderCircle,
  ClipboardPaste,
  X,
} from "lucide-react";

import {
  urlSchema,
  type UrlFormInput,
} from "@/schemas/converterSchema";

import {
  MAX_VIDEO_DURATION_MINUTES,
} from "@/utils/conversionRestrictions";

interface Props {
  onSearch: (url: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
  initialUrl?: string;
  autoFocus?: boolean;
}

export default function UrlForm({
  onSearch,
  isLoading,
  disabled = false,
  initialUrl = "",
  autoFocus = false,
}: Props) {
  const [clipboardError, setClipboardError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UrlFormInput>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: initialUrl,
    },
  });

  const url = useWatch({
    control,
    name: "url",
  });

  const isBusy = isLoading || isSubmitting;
  const isLocked = isBusy || disabled;

  async function onSubmit(data: UrlFormInput) {
    if (isLocked) return;

    setClipboardError(null);

    await onSearch(data.url);
  }

  async function handlePaste() {
    if (isLocked) return;

    setClipboardError(null);

    try {
      const text = await navigator.clipboard.readText();

      if (!text.trim()) {
        setClipboardError(
          "A área de transferência está vazia."
        );

        return;
      }

      setValue("url", text.trim(), {
        shouldDirty: true,
        shouldValidate: true,
      });

      setFocus("url");
    } catch {
      setClipboardError(
        "Não foi possível acessar a área de transferência. Cole o link manualmente."
      );
    }
  }

  function handleClear() {
    if (isLocked) return;

    setValue("url", "", {
      shouldDirty: true,
      shouldValidate: false,
    });

    clearErrors("url");
    setClipboardError(null);
    setFocus("url");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isBusy}
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
            {...register("url", {
              onChange: () => setClipboardError(null),
            })}
            id="video-url"
            type="url"
            autoFocus={autoFocus}
            inputMode="url"
            placeholder="Cole o link do YouTube aqui..."
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            readOnly={isLocked}
            aria-invalid={!!errors.url}
            aria-describedby={
              errors.url
                ? "url-hint url-error"
                : "url-hint"
            }
            className={`h-13 w-full rounded-xl border bg-background pr-24 pl-12 text-sm text-foreground transition-colors outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-primary/20 ${
              errors.url
                ? "border-error"
                : "border-border focus:border-primary"
            }`}
          />

          <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
            {url && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLocked}
                title="Limpar URL"
                aria-label="Limpar URL"
                className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground disabled:opacity-40"
              >
                <X
                  size={18}
                  aria-hidden="true"
                />
              </button>
            )}

            <button
              type="button"
              onClick={handlePaste}
              disabled={isLocked}
              title="Colar URL"
              aria-label="Colar URL da área de transferência"
              className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground disabled:opacity-40"
            >
              <ClipboardPaste
                size={18}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLocked}
          className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary-hover px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {isBusy ? (
            <>
              <LoaderCircle
                size={18}
                className="motion-safe:animate-spin"
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

      {clipboardError && (
        <p
          role="alert"
          className="mt-2 text-xs text-warning"
        >
          {clipboardError}
        </p>
      )}

      <p
        id="url-hint"
        className="mt-4 text-xs leading-relaxed text-muted"
      >
        Suporta links de vídeos do YouTube.
        Duração máxima de {MAX_VIDEO_DURATION_MINUTES} minutos.
      </p>
    </form>
  );
}