import { Link } from "~components/Link";
import { Route } from "~routes/playlists/$playlistID/index.lazy";
import { trpc } from "~utils/trpc";

export function Page() {
  const { playlistID } = Route.useParams();

  const playlist = trpc.getPlaylist.useQuery(Number(playlistID), {
    retry: false,
  });

  return (
    <>
      <section className="flex flex-col items-center px-8">
        <pre>{JSON.stringify(playlist.data, null, 2)}</pre>

        {playlist.data && <Link to={`/playlists/${playlist.data.id}/1`}>First video</Link>}
      </section>
    </>
  );
}
