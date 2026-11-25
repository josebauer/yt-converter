
import {
  Zap,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Rápido e simples",
    description:
      "Converta seus vídeos em poucos cliques, sem instalações.",
  },
  {
    icon: ShieldCheck,
    title: "Arquivos temporários",
    description:
      "Os arquivos convertidos são removidos automaticamente.",
  },
  {
    icon: Smartphone,
    title: "Totalmente responsivo",
    description:
      "Utilize o conversor no computador, tablet ou celular.",
  },
];

export default function Features() {
  return (
    <section
      aria-label="Funcionalidades"
      className="mx-auto max-w-5xl px-5 pb-20 sm:px-8"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-border bg-surface/40 p-6 text-center transition-colors hover:border-primary/30"
          >
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <feature.icon
                size={24}
                aria-hidden="true"
              />
            </div>

            <h2 className="font-semibold">
              {feature.title}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}