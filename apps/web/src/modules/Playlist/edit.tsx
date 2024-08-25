import { Link } from "~components/Link";
import { Route } from "~routes/playlists/$playlistID/edit.lazy";
import { trpc } from "~utils/trpc";

import { VideoList } from "./VideoList";

export function Page() {
  const { playlistID } = Route.useParams();

  const playlistVideos = trpc.getPlaylistVideos.useQuery(Number(playlistID));
  if (!playlistVideos.data) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col items-center px-8 gap-40">
      <Link to={`/playlists/${playlistID}`}>Back</Link>

      <VideoList playlistID={Number(playlistID)} videos={playlistVideos.data} />
    </section>
  );
}
