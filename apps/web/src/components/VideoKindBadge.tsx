import { Badge } from "@ui/components/ui/badge";
import { cn } from "@ui/lib/utils";

import { PlaylistItemKind } from "../__generated__/graphql";

const PLAYLIST_ITEM_KINDS: Record<PlaylistItemKind, { label: string; className: string }> = {
  [PlaylistItemKind.Youtube]: {
    label: "YouTube",
    className: "text-primary bg-red-700 hover:bg-red-700",
  },
  [PlaylistItemKind.TwitchClip]: {
    label: "Twitch Clip",
    className: "text-primary bg-[#6441a5] hover:bg-[#6441a5]",
  },
  [PlaylistItemKind.Reddit]: {
    label: "Reddit",
    className: "text-primary bg-[#FF5700] hover:bg-[#FF5700]",
  },
};

type Props = {
  kind: PlaylistItemKind;
  className?: string;
};

export function VideoKindBadge({ kind, className }: Props) {
  return (
    <Badge
      variant="default"
      className={cn("w-fit ", PLAYLIST_ITEM_KINDS[kind].className, className)}
    >
      {PLAYLIST_ITEM_KINDS[kind].label}
    </Badge>
  );
}
