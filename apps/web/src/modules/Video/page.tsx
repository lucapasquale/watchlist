import { Link } from "~components/Link";
import { Route } from "~routes/playlists/$playlistID/$videoID";
import { trpc } from "~utils/trpc";

import { VideoPlayer } from "./VideoPlayer";

export function Page() {
  const { playlistID, videoID } = Route.useParams();
  const video = trpc.getVideo.useQuery(Number(videoID));

  return (
    <section className="flex flex-col items-center px-8">
      <Link to={`/playlists/${playlistID}`}>Playlist</Link>

      {video.data && <VideoPlayer video={video.data} />}
    </section>
  );
}
