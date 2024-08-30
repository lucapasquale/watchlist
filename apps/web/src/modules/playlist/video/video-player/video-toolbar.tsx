import { LinkIcon, SkipForward } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";
import { Skeleton } from "@ui/components/ui/skeleton";

import { VideoKindBadge } from "~components/VideoKindBadge";
import { RouterOutput } from "~utils/trpc";

type Props = {
  video: NonNullable<RouterOutput["getPlaylistItem"]>;
  queue: RouterOutput["getPlaylistQueue"] | undefined;
};

export function VideoToolbar({ video, queue }: Props) {
  if (!queue) {
    return <Skeleton className="h-[62px]" />;
  }

  return (
    <div className="w-full flex justify-between gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-baseline gap-2 text-2xl">
          {video.title}

          <Link target="_blank" rel="noopener noreferrer" to={video.raw_url}>
            <LinkIcon className="size-4" />
          </Link>
        </h1>

        <VideoKindBadge videoKind={video.kind} />
      </div>

      <Button disabled={!queue?.[0]}>
        <Link
          search
          to="/p/$playlistID/$videoID"
          params={{
            playlistID: video.playlist_id.toString(),
            videoID: queue?.[0]?.id.toString() ?? "",
          }}
          className="flex items-center gap-2"
        >
          Next
          <SkipForward className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
