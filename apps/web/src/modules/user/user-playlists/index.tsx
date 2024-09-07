import { Link } from "@tanstack/react-router";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";

import { UserViewQuery } from "~graphql/types";

type Props = {
  user: UserViewQuery["user"];
};

export function UserPlaylists({ user }: Props) {
  return (
    <ol className="space-y-4">
      {user.playlists.map((playlist) => (
        <Card key={playlist.id}>
          <CardHeader>
            <Link to="/p/$playlistID" params={{ playlistID: playlist.id }}>
              <CardTitle className="hover:underline">{playlist.name}</CardTitle>
            </Link>

            <CardDescription>{playlist.itemsCount} videos</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </ol>
  );
}
