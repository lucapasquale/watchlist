import { Shuffle } from "lucide-react";
import { Toggle } from "@repo/ui/components/ui/toggle";

import { Link } from "~components/Link";
import { Route } from "~routes/playlists/$playlistID/$videoID";
import { RouterOutput } from "~utils/trpc";

export const SHUFFLE_KEY = "__SHUFFLE__";

type Props = {
  metadata: RouterOutput["getPlaylistMetadata"] | undefined;
};

export function WatchControls({ metadata }: Props) {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const onShufflePress = (pressed: boolean) => {
    if (!pressed) {
      localStorage.removeItem(SHUFFLE_KEY);
      return navigate({ search: { shuffle: undefined } });
    }

    localStorage.setItem(SHUFFLE_KEY, Date.now().toString());
    return navigate({ search: { shuffle: true } });
  };

  if (!metadata) {
    return null;
  }

  return (
    <div className="flex w-full justify-between gap-8">
      {metadata.previousVideoID ? (
        <Link search to="../$videoID" params={{ videoID: metadata.previousVideoID.toString() }}>
          Previous
        </Link>
      ) : (
        <div />
      )}

      <Toggle pressed={search.shuffle} onPressedChange={onShufflePress}>
        <Shuffle className="mr-2 h-4 w-4" />
        Shuffle
      </Toggle>

      {metadata.nextVideoID ? (
        <Link search to="../$videoID" params={{ videoID: metadata.nextVideoID.toString() }}>
          Next
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
