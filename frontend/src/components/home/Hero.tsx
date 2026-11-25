
import { Zap } from "lucide-react";
import Converter from "@/components/converter/Converter";

export default function Hero() {
  return (
    <section
      id="converter"
      className="relative isolate overflow-hidden px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-20"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-100 w-full max-w-200 -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]"
      />

      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Zap size={15} aria-hidden="true" />
          Conversor online
        </div>

        <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Seus vídeos, no
          <br className="hidden sm:block" />{" "}
          <span className="text-primary">
            formato que quiser.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Converta conteúdos autorizados do YouTube
          em MP3 ou MP4 de forma simples, rápida
          e sem complicações.
        </p>

        <div className="mt-10">
          <Converter />
        </div>
      </div>
    </section>
  );
}