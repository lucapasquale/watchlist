import { Badge } from "@ui/components/ui/badge";
import { cn } from "@ui/lib/utils";

import type { RouterOutput } from "~utils/trpc";

type VideoKind = NonNullable<RouterOutput["getPlaylistVideos"]>[number]["kind"];

const VIDEO_KINDS: Record<VideoKind, { label: string; className: string }> = {
  youtube: {
    label: "YouTube",
    className: "text-primary bg-red-700 hover:bg-red-700",
  },
  twitch_clip: {
    label: "Twitch Clip",
    className: "text-primary bg-[#6441a5] hover:bg-[#6441a5]",
  },
  reddit: {
    label: "Reddit",
    className: "text-primary bg-[#FF5700] hover:bg-[#FF5700]",
  },
};

type Props = {
  videoKind: VideoKind;
  className?: string;
};

export function VideoKindBadge({ videoKind, className }: Props) {
  return (
    <Badge variant="default" className={cn("w-fit ", VIDEO_KINDS[videoKind].className, className)}>
      {VIDEO_KINDS[videoKind].label}
    </Badge>
  );
}
