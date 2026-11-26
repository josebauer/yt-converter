import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[65vh] flex-col items-center justify-center px-5 py-20 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
        <FileQuestion
          size={40}
          aria-hidden="true"
        />
      </div>

      <p className="text-sm font-semibold text-primary">
        Erro 404
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Página não encontrada
      </h1>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        A página que você está procurando não existe
        ou não está mais disponível.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-hover px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700"
      >
        <ArrowLeft
          size={18}
          aria-hidden="true"
        />

        Voltar ao início
      </Link>
    </section>
  );
}
