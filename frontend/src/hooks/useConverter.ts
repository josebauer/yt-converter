"use client";

import { useState } from "react";
import { getVideoInfo } from "@/services/converterService";
import { getApiError } from "@/utils/getApiError";

import type { MediaInfo } from "@/types/converter";

export function useConverter() {
  const [video, setVideo] = useState<MediaInfo | null>(null);

  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function searchVideo(url: string) {
    setIsLoadingInfo(true);
    setError(null);
    setVideo(null);

    try {
      const mediaInfo = await getVideoInfo(url);

      setVideo(mediaInfo);
    } catch (error) {
      setError(getApiError(error));
    } finally {
      setIsLoadingInfo(false);
    }
  }

  function reset() {
    setVideo(null);
    setError(null);
  }

  return {
    video,
    isLoadingInfo,
    error,
    searchVideo,
    reset,
  };
}
