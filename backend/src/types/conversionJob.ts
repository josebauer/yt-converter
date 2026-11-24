
import type { OutputFormat } from "../services/converterService.js";

export type ConversionStatus =
  | "queued"
  | "downloading"
  | "converting"
  | "completed"
  | "failed";

export interface ConversionJobResult {
  filename: string;
  downloadUrl: string;
}

export interface ConversionJob {
  id: string;
  url: string;
  format: OutputFormat;
  status: ConversionStatus;

  createdAt: number;
  startedAt?: number;
  finishedAt?: number;

  result?: ConversionJobResult;
  error?: string;
}