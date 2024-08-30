import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";
import { Separator } from "@ui/components/ui/separator";

import { gql } from "../../__generated__";

import { CreatePlaylist } from "./create-playlist";

const HOME_QUERY = gql(/* GraphQL */ `
  query HomePlaylists {
    playlists {
      id
      name
    }
  }
`);

export function Page() {
  const { data } = useQuery(HOME_QUERY);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
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

      <Separator />

      <section>
        <CreatePlaylist />
      </section>
    </div>
  );
}
