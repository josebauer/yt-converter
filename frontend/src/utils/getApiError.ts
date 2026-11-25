import axios from "axios";

import type {
  ApiErrorResponse
} from "@/types/converter";

export function getApiError(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.code === "ECONNABORTED") {
      return "O servidor demorou para responder. Tente novamente.";
    }

    if (!error.response) {
      return "Não foi possível conectar ao servidor.";
    }

    return (
      error.response.data?.message ||
      "Não foi possível concluir a solicitação."
    );
  }

  return "Ocorreu um erro inesperado.";
}
