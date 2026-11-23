import { z } from "zod";

export const converterSchema = z.object({
  url: z.url(),
  format: z.enum(["mp3", "mp4"])
});

export type ConverterInput = z.infer<typeof converterSchema>;