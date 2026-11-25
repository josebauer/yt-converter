import { AlertCircle } from "lucide-react";

interface Props {
  message: string;
}

export default function ErrorMessage({
  message,
}: Props) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error"
    >
      <AlertCircle
        size={20}
        className="shrink-0"
        aria-hidden="true"
      />

      <p>{message}</p>
    </div>
  );
}
