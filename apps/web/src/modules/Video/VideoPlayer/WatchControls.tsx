import React from "react";
import { Shuffle } from "lucide-react";
import { Toggle } from "@repo/ui/components/ui/toggle";

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
    <div className="w-full flex items-center justify-between gap-8">
      <ChangeVideoButton videoID={metadata.previousVideoID}>Previous</ChangeVideoButton>

      <Toggle pressed={search.shuffle} onPressedChange={onShufflePress}>
        <Shuffle className="mr-2 h-4 w-4" />
        Shuffle
      </Toggle>

      <ChangeVideoButton videoID={metadata.nextVideoID}>Next</ChangeVideoButton>
    </div>
  );
}

type ChangeVideoButtonProps = React.PropsWithChildren<{
  videoID: number | null;
}>;

function ChangeVideoButton({ videoID, children }: ChangeVideoButtonProps) {
  if (!videoID) {
    return <div />;
  }

  return (
    <Link search to="../$videoID" params={{ videoID: videoID.toString() }}>
      {children}
    </Link>
  );
}
