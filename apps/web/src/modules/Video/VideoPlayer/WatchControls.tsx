import { LinkIcon, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { Toggle } from "@repo/ui/components/ui/toggle";
import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";
import { Skeleton } from "@ui/components/ui/skeleton";

import { VideoKindBadge } from "~components/VideoKindBadge";
import { Route } from "~routes/playlists/$playlistID/$videoID";
import { RouterOutput } from "~utils/trpc";

type Props = {
  video: NonNullable<RouterOutput["getVideo"]>;
  metadata: RouterOutput["getPlaylistMetadata"] | undefined;
};

export function VideoToolbar({ video, metadata }: Props) {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const onShufflePress = (pressed: boolean) => {
    const shuffle = pressed ? true : undefined;
    return navigate({ search: { shuffle } });
  };

  if (!metadata) {
    return <Skeleton className="h-[62px]" />;
  }

  return (
    <div className="w-full flex justify-between gap-8">
      <div className="flex items-center gap-2">
        <Button variant="secondary" disabled={!metadata.previousVideoID}>
          <Link
            search
            to="/playlists/$playlistID/$videoID"
            params={{
              playlistID: video.playlistID.toString(),
              videoID: metadata.previousVideoID?.toString() ?? "",
            }}
          >
            <SkipBack className="size-4" />
          </Link>
        </Button>

        <div className="flex flex-col gap-2">
          <h1 className="flex items-baseline gap-2 text-2xl">
            {video.title}

            <Link target="_blank" rel="noopener noreferrer" to={video.rawUrl}>
              <LinkIcon className="size-4" />
            </Link>
          </h1>

          <VideoKindBadge videoKind={video.kind} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Toggle
          pressed={!!search.shuffle}
          onPressedChange={onShufflePress}
          className="justify-self-center"
        >
          <Shuffle className="size-4" />
        </Toggle>

        <Button disabled={!metadata.nextVideoID}>
          <Link
            search
            to="/playlists/$playlistID/$videoID"
            params={{
              playlistID: video.playlistID.toString(),
              videoID: metadata.nextVideoID?.toString() ?? "",
            }}
            className="flex items-center gap-2"
          >
            Next
            <SkipForward className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
