export const siteConfig = {
  name: "YT Converter",

  title: "YT Converter - Conversor MP3 e MP4",

  description:
    "Converta conteúdos autorizados do YouTube em arquivos MP3 e MP4 de forma simples, rápida e prática. Conversor online com acompanhamento de progresso.",

  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000",

  locale: "pt_BR",

  language: "pt-BR",

  keywords: [
    "YT Converter",
    "conversor YouTube",
    "YouTube MP3",
    "YouTube MP4",
    "conversor MP3",
    "conversor MP4",
    "conversor de vídeo",
    "conversor de áudio",
    "conversor online",
  ],
} as const;
