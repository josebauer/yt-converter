"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  getVideoInfo,
  createConversion,
  getConversionStatus,
} from "@/services/converterService";

import { getApiError } from "@/utils/getApiError";
import { getConversionRestriction } from "@/utils/conversionRestrictions";

import type { MediaInfo, OutputFormat, ConversionJob } from "@/types/converter";

const POLLING_INTERVAL = 2000;
const COMPLETED_POLLING_INTERVAL = 30000;
const MAX_POLLING_ERRORS = 3;

export function useConverter() {
  const [video, setVideo] = useState<MediaInfo | null>(null);

  const [format, setFormat] = useState<OutputFormat>("mp3");

  const [job, setJob] = useState<ConversionJob | null>(null);

  const [jobId, setJobId] = useState<string | null>(null);

  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  const [isCreatingConversion, setIsCreatingConversion] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [pollingError, setPollingError] = useState<string | null>(null);

  const [pollingAttempt, setPollingAttempt] = useState(0);

  const isProcessing =
    job?.status === "queued" ||
    job?.status === "downloading" ||
    job?.status === "converting";

  const isBusy = isLoadingInfo || isCreatingConversion || isProcessing;

  const restriction = video ? getConversionRestriction(video) : null;

  async function searchVideo(url: string) {
    if (isBusy) return;

    setIsLoadingInfo(true);
    setError(null);
    setPollingError(null);
    setVideo(null);
    setJob(null);
    setJobId(null);
    setFormat("mp3");

    try {
      const mediaInfo = await getVideoInfo(url);

      setVideo(mediaInfo);
    } catch (error) {
      setError(getApiError(error));
    } finally {
      setIsLoadingInfo(false);
    }
  }

  async function startConversion() {
    if (!video || isBusy) return;

    const restriction = getConversionRestriction(video);

    if (restriction) {
      setError(restriction);
      return;
    }

    setIsCreatingConversion(true);
    setError(null);
    setPollingError(null);
    setJob(null);
    setJobId(null);

    try {
      const response = await createConversion({
        url: video.url,
        format,
      });

      setJob({
        id: response.id,
        format,
        status: response.status,
        progress: response.progress,
        queuePosition: response.queuePosition,
        createdAt: Date.now(),
      });

      setJobId(response.id);
    } catch (error) {
      setError(getApiError(error));
    } finally {
      setIsCreatingConversion(false);
    }
  }

  useEffect(() => {
    if (!jobId) return;

    const controller = new AbortController();

    let timeout: ReturnType<typeof setTimeout>;
    let stopped = false;
    let consecutiveErrors = 0;

    async function pollStatus() {
      if (stopped || !jobId) return;

      try {
        const currentJob = await getConversionStatus(jobId, controller.signal);

        if (stopped) return;

        consecutiveErrors = 0;

        setPollingError(null);
        setJob(currentJob);

        if (currentJob.status === "failed" || currentJob.status === "expired") {
          return;
        }

        const interval =
          currentJob.status === "completed"
            ? COMPLETED_POLLING_INTERVAL
            : POLLING_INTERVAL;

        timeout = setTimeout(pollStatus, interval);
      } catch (error) {
        if (stopped || axios.isCancel(error)) {
          return;
        }

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setJob((previousJob) =>
            previousJob
              ? {
                  ...previousJob,
                  status: "expired",
                }
              : null,
          );

          setPollingError(null);

          return;
        }

        consecutiveErrors++;

        if (consecutiveErrors >= MAX_POLLING_ERRORS) {
          setPollingError(
            "Não foi possível acompanhar a conversão. Tente reconectar.",
          );

          return;
        }

        timeout = setTimeout(pollStatus, POLLING_INTERVAL * consecutiveErrors);
      }
    }

    void pollStatus();

    return () => {
      stopped = true;

      controller.abort();

      clearTimeout(timeout);
    };
  }, [jobId, pollingAttempt]);

  function retryPolling() {
    if (!jobId) return;

    setPollingError(null);

    setPollingAttempt((previous) => previous + 1);
  }

  function resetConversion() {
    if (isBusy) return;

    setJob(null);
    setJobId(null);
    setError(null);
    setPollingError(null);
  }

  function reset() {
    if (isBusy) return;

    setVideo(null);
    setFormat("mp3");
    setJob(null);
    setJobId(null);
    setError(null);
    setPollingError(null);
  }

  return {
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
  };
}
