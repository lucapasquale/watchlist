import { Shuffle, SkipBack, SkipForward } from "lucide-react";
import { Toggle } from "@repo/ui/components/ui/toggle";
import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";

import { Route } from "~routes/playlists/$playlistID/$videoID";
import { RouterOutput } from "~utils/trpc";

type Props = {
  video: NonNullable<RouterOutput["getVideo"]>;
  metadata: RouterOutput["getPlaylistMetadata"] | undefined;
};

export function WatchControls({ video, metadata }: Props) {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const onShufflePress = (pressed: boolean) => {
    if (!pressed) {
      return navigate({ search: { shuffle: undefined } });
    }

    return navigate({ search: { shuffle: true } });
  };

  if (!metadata) {
    return null;
  }

  return (
    <div className="w-full flex justify-between gap-8">
      <div className="flex items-center gap-2">
        <Button disabled={!metadata.previousVideoID}>
          <Link
            search
            to="/playlists/$playlistID/$videoID"
            params={{
              playlistID: video.playlistID.toString(),
              videoID: metadata.previousVideoID?.toString() ?? "",
            }}
          >
            <SkipBack className="h-4 w-4" />
          </Link>
        </Button>

        <h1 className="text-2xl">{video.title}</h1>
      </div>

      <div className="flex gap-2">
        <Toggle
          variant="outline"
          pressed={search.shuffle}
          onPressedChange={onShufflePress}
          className="justify-self-center"
        >
          <Shuffle className="h-4 w-4" />
        </Toggle>

        <Button disabled={!metadata.nextVideoID}>
          <Link
            search
            to="/playlists/$playlistID/$videoID"
            params={{
              playlistID: video.playlistID.toString(),
              videoID: metadata.nextVideoID?.toString() ?? "",
            }}
          >
            <SkipForward className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
