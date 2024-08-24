import { Link } from "~components/Link";
import { Route } from "~routes/playlists/$playlistID/index.lazy";
import { trpc } from "~utils/trpc";

export function Page() {
  const { playlistID } = Route.useParams();

  const playlist = trpc.getPlaylist.useQuery(Number(playlistID));
  const playlistVideos = trpc.getPlaylistVideos.useQuery(Number(playlistID));

  if (!playlist.data || !playlistVideos.data) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col items-center px-8 gap-40">
      {playlist.data.name}

      {playlistVideos.data.length ? (
        <Link to={`/playlists/${playlistID}/${playlistVideos.data[0].id}`}>Play</Link>
      ) : null}

      <Link to={`/playlists/${playlistID}/edit`}>Edit videos</Link>
    </section>
  );
}
