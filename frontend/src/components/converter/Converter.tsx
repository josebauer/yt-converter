"use client";

import { useState } from "react";

import {
  RefreshCw,
  LoaderCircle,
  Plus,
  Wifi,
} from "lucide-react";

import { useConverter } from "@/hooks/useConverter";

import ErrorMessage from "@/components/common/ErrorMessage";

import UrlForm from "./UrlForm";
import VideoInfo from "./VideoInfo";
import FormatSelector from "./FormatSelector";
import ConversionProgress from "./ConversionProgress";
import DownloadButton from "./DownloadButton";

export default function Converter() {
  const [formKey, setFormKey] = useState(0);

  const {
    video,
    format,
    setFormat,
    job,
    error,
    pollingError,
    restriction,
    isLoadingInfo,
    isCreatingConversion,
    isProcessing,
    isBusy,
    searchVideo,
    startConversion,
    retryPolling,
    resetConversion,
    reset,
  } = useConverter();

  function handleReset() {
    if (isBusy) return;

    reset();

    setFormKey((previous) => previous + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 text-left shadow-2xl shadow-black/20 sm:p-7">
      <UrlForm
        key={formKey}
        onSearch={searchVideo}
        isLoading={isLoadingInfo}
        disabled={
          isCreatingConversion || isProcessing
        }
      />

      {error && (
        <div className="mt-5">
          <ErrorMessage message={error} />
        </div>
      )}

      {video && (
        <div className="mt-6 space-y-6 border-t border-border pt-6">
          <VideoInfo video={video} />

          {restriction ? (
            <ErrorMessage message={restriction} />
          ) : (
            <>
              {!job && (
                <>
                  <FormatSelector
                    value={format}
                    onChange={setFormat}
                    disabled={isBusy}
                  />

                  <button
                    type="button"
                    onClick={startConversion}
                    disabled={isBusy}
                    className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary-hover px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                  >
                    {isCreatingConversion ? (
                      <>
                        <LoaderCircle
                          size={19}
                          className="motion-safe:animate-spin"
                          aria-hidden="true"
                        />

                        Solicitando conversão...
                      </>
                    ) : (
                      <>
                        <RefreshCw
                          size={18}
                          aria-hidden="true"
                        />

                        Converter para {format.toUpperCase()}
                      </>
                    )}
                  </button>
                </>
              )}

              {job && (
                <ConversionProgress job={job} />
              )}

              {pollingError && (
                <div className="space-y-3">
                  <ErrorMessage
                    message={pollingError}
                  />

                  <button
                    type="button"
                    onClick={retryPolling}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium transition-colors hover:bg-background"
                  >
                    <Wifi
                      size={18}
                      aria-hidden="true"
                    />

                    Reconectar
                  </button>
                </div>
              )}

              {job?.status === "completed" &&
                job.result && (
                  <DownloadButton
                    result={job.result}
                    format={job.format}
                  />
                )}

              {job &&
                (
                  job.status === "completed" ||
                  job.status === "failed" ||
                  job.status === "expired"
                ) && (
                  <button
                    type="button"
                    onClick={resetConversion}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium transition-colors hover:bg-background"
                  >
                    <RefreshCw
                      size={16}
                      aria-hidden="true"
                    />

                    {job.status === "completed"
                      ? "Converter em outro formato"
                      : "Tentar novamente"}
                  </button>
                )}
            </>
          )}

          {!isBusy && (
            <button
              type="button"
              onClick={handleReset}
              className="mx-auto flex items-center justify-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              <Plus
                size={17}
                aria-hidden="true"
              />

              Converter outro vídeo
            </button>
          )}
        </div>
      )}
    </div>
  );
}