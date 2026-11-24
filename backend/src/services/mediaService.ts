
import axios from "axios";

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      high?: {
        url: string;
      };
      medium?: {
        url: string;
      };
    };
  };
  contentDetails: {
    duration: string;
  };
}

interface YouTubeApiResponse {
  items: YouTubeVideo[];
}

export interface MediaInfo {
  id: string;
  title: string;
  description: string;
  channel: string;
  thumbnail: string | null;
  duration: string;
  url: string;
}

export function extractVideoId(url: string): string {
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.toLowerCase();

  let videoId: string | null = null;

  if (
    hostname === "youtube.com" ||
    hostname === "www.youtube.com" ||
    hostname === "m.youtube.com"
  ) {
    if (parsedUrl.pathname === "/watch") {
      videoId = parsedUrl.searchParams.get("v");
    } else {
      const match = parsedUrl.pathname.match(
        /^\/(?:shorts|live|embed)\/([^/]+)\/?$/
      );

      videoId = match?.[1] ?? null;
    }
  } else if (
    hostname === "youtu.be" ||
    hostname === "www.youtu.be"
  ) {
    videoId = parsedUrl.pathname.split("/")[1] ?? null;
  }

  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    throw new Error("URL do YouTube inválida.");
  }

  return videoId;
}

function formatDuration(duration: string): string {
  const match = duration.match(
    /^P(?:\d+D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
  );

  if (!match) return duration;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  const totalSeconds =
    hours * 3600 + minutes * 60 + seconds;

  const totalHours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor(
    (totalSeconds % 3600) / 60
  );
  const remainingSeconds = totalSeconds % 60;

  if (totalHours > 0) {
    return [
      totalHours,
      String(remainingMinutes).padStart(2, "0"),
      String(remainingSeconds).padStart(2, "0")
    ].join(":");
  }

  return [
    remainingMinutes,
    String(remainingSeconds).padStart(2, "0")
  ].join(":");
}

export async function getMediaInfo(
  url: string
): Promise<MediaInfo> {
  const videoId = extractVideoId(url);
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("Chave da API do YouTube não configurada.");
  }

  const response = await axios.get<YouTubeApiResponse>(
    "https://www.googleapis.com/youtube/v3/videos",
    {
      params: {
        part: "snippet,contentDetails",
        id: videoId,
        key: apiKey
      },
      timeout: 10000
    }
  );

  const video = response.data.items[0];

  if (!video) {
    throw new Error("Vídeo não encontrado ou indisponível.");
  }

  return {
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    channel: video.snippet.channelTitle,
    thumbnail:
      video.snippet.thumbnails.high?.url ??
      video.snippet.thumbnails.medium?.url ??
      null,
    duration: formatDuration(video.contentDetails.duration),
    url: `https://www.youtube.com/watch?v=${video.id}`
  };
}
