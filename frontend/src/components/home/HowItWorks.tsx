import {
  Link2,
  FileAudio,
  Download,
} from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Cole o link",
    description:
      "Copie a URL do vídeo do YouTube e cole no conversor.",
  },
  {
    icon: FileAudio,
    title: "Escolha o formato",
    description:
      "Selecione MP3 para áudio ou MP4 para vídeo e inicie a conversão.",
  },
  {
    icon: Download,
    title: "Baixe seu arquivo",
    description:
      "Aguarde o processamento e faça o download do arquivo convertido.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-border bg-surface/30 px-5 py-20 sm:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Como funciona?
          </h2>

          <p className="mt-3 text-muted">
            Converta seus vídeos em três etapas simples.
          </p>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="text-center"
            >
              <div className="relative mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-border bg-surface text-primary">
                <step.icon
                  size={28}
                  aria-hidden="true"
                />

                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-primary-hover text-xs font-bold text-white">
                  {index + 1}
                </span>
              </div>

              <h3 className="text-lg font-semibold">
                {step.title}
              </h3>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}