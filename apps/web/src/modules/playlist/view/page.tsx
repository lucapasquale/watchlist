import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";

import { PlaylistViewDocument } from "~graphql/types";
import { Route } from "~routes/p/$playlistID/index.lazy";

import { SortableItems } from "./sortable-items";

export function Page() {
  const { playlistID } = Route.useParams();
  const shuffleSeed = React.useRef(Date.now().toString());

  const { data } = useQuery(PlaylistViewDocument, {
    variables: { playlistID, shuffleSeed: shuffleSeed.current },
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
      <article>
        {data.playlist.name}

        <div className="flex gap-4">
          {data.playlist.firstItem && (
            <Link
              to="/p/$playlistID/$videoID"
              params={{ playlistID, videoID: data.playlist.firstItem.id.toString() }}
            >
              Play
            </Link>
          )}

          {data.playlist.shuffleFirstItem && (
            <Link
              to="/p/$playlistID/$videoID"
              params={{ playlistID, videoID: data.playlist.shuffleFirstItem.id.toString() }}
              search={{ shuffleSeed: shuffleSeed.current }}
            >
              Shuffle
            </Link>
          )}
        </div>
      </article>

      <SortableItems />
    </section>
  );
}
