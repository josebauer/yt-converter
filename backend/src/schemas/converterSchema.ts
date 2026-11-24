import { z } from "zod";

export const converterSchema = z.object({
  url: z.url().refine(
    (url) => new URL(url).protocol === "https:",
    {
      message: "A URL deve utilizar HTTPS."
    }
  ),
  format: z.enum(["mp3", "mp4"])
})

export type ConverterInput = z.infer<typeof converterSchema>