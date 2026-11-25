import { api } from "./api";

import type {
  ApiResponse,
  MediaInfo,
  ConversionInput,
  ConversionJob,
  CreateConversionResponse,
} from "@/types/converter";

export async function getVideoInfo(
  url: string
): Promise<MediaInfo> {
  const response = await api.post<ApiResponse<MediaInfo>>(
    "/converter/info",
    { url }
  );

  return response.data.data;
}

export async function createConversion(
  input: ConversionInput
): Promise<CreateConversionResponse> {
  const response = await api.post<
    ApiResponse<CreateConversionResponse>
  >(
    "/converter/convert",
    input
  );

  return response.data.data;
}

export async function getConversionStatus(
  id: string,
  signal?: AbortSignal
): Promise<ConversionJob> {
  const response = await api.get<ApiResponse<ConversionJob>>(
    `/converter/status/${id}`,
    { signal }
  );

  return response.data.data;
}

export function getDownloadUrl(
  downloadPath: string
): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("URL da API não configurada.");
  }

  const baseUrl = new URL(apiUrl);

  const downloadUrl = new URL(
    downloadPath,
    baseUrl.origin
  );

  if (downloadUrl.origin !== baseUrl.origin) {
    throw new Error("URL de download inválida.");
  }

  return downloadUrl.href;
}