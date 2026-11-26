import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="YT Converter - Página inicial"
      className="inline-flex items-center gap-2.5"
    >
      <Image
        src="/icon.svg"
        alt=""
        width={36}
        height={36}
        unoptimized
      />

      <span className="text-xl font-bold tracking-tight">
        YT<span className="text-primary">Converter</span>
      </span>
    </Link>
  );
}