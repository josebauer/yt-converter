import { z } from "zod";

const allowedHosts = [
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
];

export const urlSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Informe a URL do vídeo.")
    .pipe(z.url({
      error: "Informe uma URL válida.",
    }))
    .refine((value) => {
      try {
        const url = new URL(value);

        return (
          ["http:", "https:"].includes(url.protocol) &&
          allowedHosts.includes(url.hostname)
        );
      } catch {
        return false;
      }
    }, {
      message: "Informe uma URL válida do YouTube.",
    }),
});

export type UrlFormInput = z.infer<typeof urlSchema>;