import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";

import { HomePlaylistsDocument } from "~common/graphql-types";

export function Page() {
  const { data } = useQuery(HomePlaylistsDocument);

  if (!data) {
    return <main>Loading...</main>;
  }

  return (
    <main className="flex flex-col gap-8">
      <section>
        <h2 className="text-xl mb-6">Playlists:</h2>

        <ol className="flex flex-col gap-8">
          {data.playlists.map((playlist) => (
            <li key={playlist.id}>
              <Link to="/p/$playlistID" params={{ playlistID: playlist.id.toString() }}>
                {playlist.name}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
