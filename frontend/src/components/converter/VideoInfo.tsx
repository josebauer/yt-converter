import Image from "next/image";
import { Clock, UserRound } from "lucide-react";
import { formatDuration } from "@/utils/formatDuration";
import type { MediaInfo } from "@/types/converter";

interface Props {
  video: MediaInfo;
}

export default function VideoInfo({
  video,
}: Props) {
  const duration = formatDuration(
    video.durationInSeconds
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-background sm:w-48">
        <Image
          src={video.thumbnail}
          alt={`Thumbnail de ${video.title}`}
          fill
          sizes="(max-width: 640px) 100vw, 192px"
          className="object-cover"
        />

        <span className="absolute right-2 bottom-2 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white">
          {duration}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="line-clamp-2 text-base leading-snug font-semibold sm:text-lg">
          {video.title}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <UserRound
              size={15}
              aria-hidden="true"
            />

            {video.channel}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock
              size={15}
              aria-hidden="true"
            />

            {duration}
          </span>
        </div>
      </div>
    </div>
  );
}
