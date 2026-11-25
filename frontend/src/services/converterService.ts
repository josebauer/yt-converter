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
  id: string
): Promise<ConversionJob> {
  const response = await api.get<ApiResponse<ConversionJob>>(
    `/converter/status/${id}`
  );

  return response.data.data;
}