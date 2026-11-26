import {
  Clock3,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TimerOff,
} from "lucide-react";

import type {
  ConversionJob,
  ConversionStatus,
} from "@/types/converter";

interface Props {
  job: ConversionJob;
}

const statusConfig = {
  queued: {
    title: "Aguardando na fila",
    description:
      "Sua conversão será iniciada assim que houver disponibilidade.",
    icon: Clock3,
    color: "text-warning",
  },
  downloading: {
    title: "Baixando mídia",
    description:
      "Estamos preparando a mídia para conversão.",
    icon: Download,
    color: "text-primary",
  },
  converting: {
    title: "Convertendo arquivo",
    description:
      "Estamos processando o arquivo no formato escolhido.",
    icon: RefreshCw,
    color: "text-primary",
  },
  completed: {
    title: "Conversão concluída!",
    description:
      "Seu arquivo está pronto para download.",
    icon: CheckCircle2,
    color: "text-success",
  },
  failed: {
    title: "Falha na conversão",
    description:
      "Não foi possível concluir a conversão.",
    icon: AlertCircle,
    color: "text-error",
  },
  expired: {
    title: "Arquivo expirado",
    description:
      "O arquivo não está mais disponível. Realize uma nova conversão.",
    icon: TimerOff,
    color: "text-warning",
  },
} satisfies Record<
  ConversionStatus,
  {
    title: string;
    description: string;
    icon: typeof Clock3;
    color: string;
  }
>;

export default function ConversionProgress({
  job,
}: Props) {
  const config = statusConfig[job.status];

  const Icon = config.icon;

  const progress = Number.isFinite(job.progress)
    ? Math.min(100, Math.max(0, job.progress))
    : 0;

  const isProcessing =
    job.status === "queued" ||
    job.status === "downloading" ||
    job.status === "converting";

  return (
    <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <div
        role="status"
        className="flex items-center gap-3"
      >
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface ${config.color}`}>
          <Icon
            size={21}
            aria-hidden="true"
            className={
              job.status === "converting"
                ? "motion-safe:animate-spin"
                : ""
            }
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold ${config.color}`}>
            {config.title}
          </p>

          <p className="mt-1 text-xs text-muted">
            {job.status === "failed"
              ? job.error || config.description
              : config.description}
          </p>
        </div>
      </div>

      {(isProcessing || job.status === "completed") && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted">
              Progresso
            </span>

            <span className="font-semibold tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="Progresso da conversão"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            className="h-2 overflow-hidden rounded-full bg-border"
          >
            <div
              style={{ width: `${progress}%` }}
              className={`h-full rounded-full transition-all duration-500 motion-reduce:transition-none ${job.status === "completed"
                  ? "bg-success"
                  : "bg-primary"
                }`}
            />
          </div>
        </div>
      )}

      {job.status === "queued" &&
        job.queuePosition > 0 && (
          <p className="mt-3 text-xs text-warning">
            Posição na fila: {job.queuePosition}
          </p>
        )}
    </div>
  );
}