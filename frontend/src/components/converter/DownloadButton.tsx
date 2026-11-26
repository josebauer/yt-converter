import {
  Download,
  FileCheck2,
} from "lucide-react";

import {
  getDownloadUrl,
} from "@/services/converterService";

import type {
  ConversionResult,
  OutputFormat,
} from "@/types/converter";

interface Props {
  result: ConversionResult;
  format: OutputFormat;
}

export default function DownloadButton({
  result,
  format,
}: Props) {
  const downloadUrl = getDownloadUrl(
    result.downloadUrl
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-success/20 bg-success/5 p-4">
        <FileCheck2
          size={23}
          className="shrink-0 text-success"
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted">
            Arquivo disponível
          </p>

          <p
            title={result.downloadFilename}
            className="mt-1 truncate text-sm font-medium"
          >
            {result.downloadFilename}
          </p>
        </div>
      </div>

      <a
        href={downloadUrl}
        className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-green-800"
      >
        <Download
          size={19}
          aria-hidden="true"
        />

        Baixar arquivo {format.toUpperCase()}
      </a>

      <p className="mt-3 text-center text-xs leading-relaxed text-muted">
        Os arquivos são armazenados temporariamente.
        Faça o download antes que expirem.
      </p>
    </div>
  );
}