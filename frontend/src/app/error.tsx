"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: Props) {
  return (
    <section className="flex min-h-[65vh] flex-col items-center justify-center px-5 py-20 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl border border-error/20 bg-error/10 text-error">
        <AlertTriangle
          size={40}
          aria-hidden="true"
        />
      </div>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Algo deu errado
      </h1>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        Ocorreu um erro inesperado. Tente novamente
        ou retorne à página inicial.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-hover px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <RefreshCw
            size={18}
            aria-hidden="true"
          />

          Tentar novamente
        </button>

        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 text-sm font-medium transition-colors hover:bg-surface"
        >
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}