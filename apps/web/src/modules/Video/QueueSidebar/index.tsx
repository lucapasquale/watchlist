import { Link } from "@tanstack/react-router";
import { Skeleton } from "@ui/components/ui/skeleton";

import { trpc } from "~utils/trpc";

type Props = {
  playlistID: number;
};

export function QueueSidebar({ playlistID }: Props) {
  const playlist = trpc.getPlaylist.useQuery(playlistID);

  if (!playlist.data) {
    return <Skeleton />;
  }

  return (
    <aside className="rounded-md bg-gray-700 p-4">
      <Link to={`/playlists/${playlistID}`}>{playlist.data.name}</Link>
    </aside>
  );
}
