
import type { OutputFormat } from "../services/converterService.js";

export type ConversionStatus =
  | "queued"
  | "downloading"
  | "converting"
  | "completed"
  | "failed"
  | "expired"

export interface ConversionJobResult {
  filename: string;
  downloadFilename: string;
  downloadUrl: string;
}

export interface ConversionJob {
  id: string;
  url: string;
  title: string;
  format: OutputFormat;
  status: ConversionStatus;

  progress: number;

  createdAt: number;
  startedAt?: number;
  finishedAt?: number;

  result?: ConversionJobResult;
  error?: string;
}

export type ProgressCallback = (progress: number) => void