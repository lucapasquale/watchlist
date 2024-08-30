import { Link } from "@tanstack/react-router";
import { Separator } from "@ui/components/ui/separator";

import { trpc } from "~utils/trpc";

import { CreatePlaylist } from "./create-playlist";

export function Page() {
  const playlists = trpc.getAllPlaylists.useQuery();

  if (playlists.isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-xl mb-6">Playlists:</h2>

        <ol className="flex flex-col gap-8">
          {playlists.data?.map((playlist) => (
            <li key={playlist.id}>
              <Link to="/p/$playlistID" params={{ playlistID: playlist.id.toString() }}>
                {playlist.name}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <Separator />

      <section>
        <CreatePlaylist />
      </section>
    </div>
  );
}
