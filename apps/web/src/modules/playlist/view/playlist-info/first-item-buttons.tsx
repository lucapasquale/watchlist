import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";
import { Play, Shuffle } from "lucide-react";
import React from "react";

import { Button } from "@ui/components/ui/button.js";
import { CardFooter } from "@ui/components/ui/card.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";

import { PlaylistViewQuery, PlaylistViewShuffleFirstItemDocument } from "~common/graphql-types.js";

type Props = {
  playlist: PlaylistViewQuery["playlist"];
};

export function FirstItemButtons({ playlist }: Props) {
  const shuffleSeed = React.useRef(Date.now().toString());

  const { data } = useQuery(PlaylistViewShuffleFirstItemDocument, {
    skip: !playlist.firstItem,
    variables: {
      playlistID: playlist.id,
      shuffleSeed: shuffleSeed.current,
    },
  });

  if (!playlist.firstItem) {
    return null;
  }

  if (!data) {
    return (
      <CardFooter>
        <Skeleton className="h-10" />
      </CardFooter>
    );
  }

  return (
    <CardFooter className="flex items-center justify-between gap-4">
      {data.playlist.shuffleFirstItem && (
        <Link
          to="/p/$playlistID/$videoID"
          params={{
            playlistID: playlist.id,
            videoID: data.playlist.shuffleFirstItem.id,
          }}
          search={{ shuffleSeed: shuffleSeed.current }}
          className="w-full"
        >
          <Button tabIndex={-1} variant="secondary" className="w-full">
            Shuffle <Shuffle className="size-4" />
          </Button>
        </Link>
      )}

      {playlist.firstItem && (
        <Link
          to="/p/$playlistID/$videoID"
          params={{ playlistID: playlist.id, videoID: playlist.firstItem.id }}
          className="w-full"
        >
          <Button tabIndex={-1} className="w-full">
            Play <Play className="size-4" />
          </Button>
        </Link>
      )}
    </CardFooter>
  );
}
