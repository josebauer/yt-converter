"use client";

import { useConverter } from "@/hooks/useConverter";
import ErrorMessage from "@/components/common/ErrorMessage";
import UrlForm from "./UrlForm";
import VideoInfo from "./VideoInfo";

export default function Converter() {
  const {
    video,
    isLoadingInfo,
    error,
    searchVideo,
  } = useConverter();

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 text-left shadow-2xl shadow-black/20 sm:p-7">
      <UrlForm
        onSearch={searchVideo}
        isLoading={isLoadingInfo}
      />

      {error && (
        <div className="mt-5">
          <ErrorMessage message={error} />
        </div>
      )}

      {video && (
        <div className="mt-6 border-t border-border pt-6">
          <VideoInfo video={video} />
        </div>
      )}
    </div>
  );
}