import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";

import { PlaylistViewDocument } from "~graphql/types";
import { Route } from "~routes/p/$playlistID/index.lazy";

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
    <section className="flex flex-col items-center px-8 gap-40">
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

      <Link to="/p/$playlistID/edit" params={{ playlistID }}>
        Edit videos
      </Link>
    </section>
  );
}
