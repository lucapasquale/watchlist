import React from "react";
import { Link } from "@tanstack/react-router";

import { Route } from "~routes/playlists/$playlistID/index.lazy";
import { trpc } from "~utils/trpc";

export function Page() {
  const { playlistID } = Route.useParams();

  const playlist = trpc.getPlaylist.useQuery(Number(playlistID));

  const shuffleSeed = React.useRef(Date.now().toString());

  const firstVideo = trpc.getPlaylistInitialVideo.useQuery({
    playlistID: Number(playlistID),
    shuffleSeed: shuffleSeed.current,
  });

  if (!playlist.data) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col items-center px-8 gap-40">
      {playlist.data.name}

      {firstVideo.data && (
        <div className="flex gap-4">
          {firstVideo.data.regular && (
            <Link
              to="/playlists/$playlistID/$videoID"
              params={{ playlistID, videoID: firstVideo.data.regular.id.toString() }}
            >
              Play
            </Link>
          )}

          {firstVideo.data.shuffle && (
            <Link
              to="/playlists/$playlistID/$videoID"
              params={{ playlistID, videoID: firstVideo.data.shuffle.id.toString() }}
              search={{ shuffleSeed: shuffleSeed.current }}
            >
              Shuffle
            </Link>
          )}
        </div>
      )}

      <Link to={`/playlists/${playlistID}/edit`}>Edit videos</Link>
    </section>
  );
}
