
export type OutputFormat = "mp3" | "mp4";

export type ConversionStatus =
  | "queued"
  | "downloading"
  | "converting"
  | "completed"
  | "failed"
  | "expired";

export interface MediaInfo {
  id: string;
  title: string;
  description: string;
  channel: string;
  thumbnail: string;
  duration: string;
  durationInSeconds: number;
  liveBroadcastContent: "none" | "live" | "upcoming";
  url: string;
}

export interface ConversionInput {
  url: string;
  format: OutputFormat;
}

export interface ConversionResult {
  filename: string;
  downloadFilename: string;
  downloadUrl: string;
  size: number;
}

export interface ConversionJob {
  id: string;
  format: OutputFormat;
  status: ConversionStatus;
  progress: number;
  queuePosition: number;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  result?: ConversionResult;
  error?: string;
}

export interface CreateConversionResponse {
  id: string;
  status: ConversionStatus;
  progress: number;
  queuePosition: number;
  statusUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}