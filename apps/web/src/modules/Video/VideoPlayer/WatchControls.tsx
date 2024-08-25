import { Shuffle, SkipBack, SkipForward } from "lucide-react";
import { Toggle } from "@repo/ui/components/ui/toggle";
import { Button } from "@ui/components/ui/button";

import { Link } from "~components/Link";
import { Route } from "~routes/playlists/$playlistID/$videoID";
import { RouterOutput } from "~utils/trpc";

type Props = {
  metadata: RouterOutput["getPlaylistMetadata"] | undefined;
};

export function WatchControls({ metadata }: Props) {
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
      <Link search to="../$videoID" params={{ videoID: metadata.previousVideoID?.toString() }}>
        <Button disabled={!metadata.previousVideoID}>
          <SkipBack className="h-4 w-4" />
        </Button>
      </Link>

      <div className="flex gap-2">
        <Toggle
          variant="outline"
          pressed={search.shuffle}
          onPressedChange={onShufflePress}
          className="justify-self-center"
        >
          <Shuffle className="h-4 w-4" />
        </Toggle>

        <Link search to="../$videoID" params={{ videoID: metadata.nextVideoID?.toString() }}>
          <Button disabled={!metadata.nextVideoID}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
