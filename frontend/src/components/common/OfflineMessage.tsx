import { WifiOff } from "lucide-react";

export default function OfflineMessage() {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-warning/20 bg-warning/10 p-4"
    >
      <WifiOff
        size={21}
        className="shrink-0 text-warning"
        aria-hidden="true"
      />

      <div>
        <p className="text-sm font-semibold text-warning">
          Sem conexão com a internet
        </p>

        <p className="mt-1 text-xs leading-relaxed text-muted">
          Verifique sua conexão. Caso exista uma conversão
          em andamento, ela poderá continuar sendo
          processada pelo servidor.
        </p>
      </div>
    </div>
  );
}