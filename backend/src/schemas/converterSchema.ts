import { z } from "zod";
import { extractVideoId } from "../services/mediaService.js";

export const converterSchema = z.object({
  url: z.url().refine(
    (url) => {
      try {
        return (
          new URL(url).protocol === "https:" &&
          Boolean(extractVideoId(url))
        );
      } catch {
        return false;
      }
    },
    {
      message: "Informe uma URL válida do YouTube."
    }
  ),
  format: z.enum(["mp3", "mp4"])
})

export type ConverterInput = z.infer<typeof converterSchema>;

export const downloadSchema = z.object({
  filename: z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(mp3|mp4)$/i,
    "Nome de arquivo inválido."
  )
})