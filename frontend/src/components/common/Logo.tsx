import Link from "next/link";
import { Play } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5"
      aria-label="YT Converter - Página inicial"
    >
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary">
        <Play
          size={20}
          fill="currentColor"
          className="text-white"
          aria-hidden="true"
        />
      </div>

      <span className="text-xl font-bold tracking-tight">
        YT<span className="text-primary">Converter</span>
      </span>
    </Link>
  );
}