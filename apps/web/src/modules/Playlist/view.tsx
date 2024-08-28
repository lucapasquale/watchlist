import React from "react";
import { Link } from "@tanstack/react-router";

import { Route } from "~routes/p/$playlistID/index.lazy";
import { trpc } from "~utils/trpc";

export function Page() {
  const { playlistID } = Route.useParams();

  const playlist = trpc.getPlaylist.useQuery(Number(playlistID));

  const shuffleSeed = React.useRef(Date.now().toString());

  const firstItem = trpc.getPlaylistInitialItem.useQuery({
    playlistID: Number(playlistID),
    shuffleSeed: shuffleSeed.current,
  });

  if (!playlist.data) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col items-center px-8 gap-40">
      {playlist.data.name}

      {firstItem.data && (
        <div className="flex gap-4">
          {firstItem.data.regular && (
            <Link
              to="/p/$playlistID/$videoID"
              params={{ playlistID, videoID: firstItem.data.regular.id.toString() }}
            >
              Play
            </Link>
          )}

          {firstItem.data.shuffle && (
            <Link
              to="/p/$playlistID/$videoID"
              params={{ playlistID, videoID: firstItem.data.shuffle.id.toString() }}
              search={{ shuffleSeed: shuffleSeed.current }}
            >
              Shuffle
            </Link>
          )}
        </div>
      )}

      <Link to="/p/$playlistID/edit" params={{ playlistID }}>
        Edit videos
      </Link>
    </section>
  );
}
