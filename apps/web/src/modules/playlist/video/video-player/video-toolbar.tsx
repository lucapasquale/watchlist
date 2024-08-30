import { LinkIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { VideoKindBadge } from "~components/VideoKindBadge";

import { PlaylistItemViewQuery } from "../../../../__generated__/graphql";

type Props = {
  playlistItem: PlaylistItemViewQuery["playlistItem"];
};

export function VideoToolbar({ playlistItem }: Props) {
  return (
    <div className="w-full flex justify-between gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-baseline gap-2 text-2xl">
          {playlistItem.title}

          <Link target="_blank" rel="noopener noreferrer" to={playlistItem.rawUrl}>
            <LinkIcon className="size-4" />
          </Link>
        </h1>

        <VideoKindBadge kind={playlistItem.kind} />
      </div>

      {/* <Button disabled={!queue?.[0]}>
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
      </Button> */}
    </div>
  );
}
