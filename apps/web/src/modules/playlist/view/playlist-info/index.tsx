import { Play, Shuffle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";

import { PlaylistViewQuery } from "~graphql/types";
import { Route } from "~routes/p/$playlistID/index.lazy";

type Props = {
  playlist: PlaylistViewQuery["playlist"];
  shuffleSeed: string;
};

export function PlaylistInfo({ playlist, shuffleSeed }: Props) {
  const { playlistID } = Route.useParams();

  return (
    <section className="rounded-xl flex flex-col gap-4 p-4 bg-gray-600">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl">{playlist.name}</h1>

        <h3 className="text-sm">{playlist.itemsCount} videos</h3>
      </div>

      <div className="flex items-center justify-between gap-4">
        {playlist.shuffleFirstItem && (
          <Link
            to="/p/$playlistID/$videoID"
            params={{ playlistID, videoID: playlist.shuffleFirstItem.id.toString() }}
            search={{ shuffleSeed }}
            className="w-full"
          >
            <Button variant="secondary" className="w-full">
              Shuffle <Shuffle className="size-4 ml-2" />
            </Button>
          </Link>
        )}

        {playlist.firstItem && (
          <Link
            to="/p/$playlistID/$videoID"
            params={{ playlistID, videoID: playlist.firstItem.id.toString() }}
            className="w-full"
          >
            <Button className="w-full">
              Play <Play className="size-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
