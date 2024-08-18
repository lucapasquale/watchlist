import { Link } from "~components/Link";
import { Route } from "~routes/playlists/$playlistID/$videoID.lazy";
import { trpc } from "~utils/trpc";

import { VideoPlayer } from "./VideoPlayer";

export function Page() {
  const navigate = Route.useNavigate();
  const { playlistID, videoID } = Route.useParams();

  const video = trpc.getVideo.useQuery(Number(videoID));

  const onVideoEnded = () => {
    if (video.data?.metadata.nextVideoID) {
      navigate({
        to: "/playlists/$playlistID/$videoID",
        params: { playlistID, videoID: video.data.metadata.nextVideoID.toString() },
      });
    }
  };

  return (
    <>
      <article className="flex flex-col items-center px-8">
        <Link to={`/playlists/${playlistID}`}>Playlist</Link>

        {video.data && <VideoPlayer videoData={video.data} onVideoEnded={onVideoEnded} />}
      </article>
    </>
  );
}
