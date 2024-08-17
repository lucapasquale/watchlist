import ReactPlayer from "react-player";

import { Route } from "~routes/playlists/$playlistID/$videoID.lazy";
import { trpc } from "~utils/trpc";

export function Page() {
  const { playlistID, videoID } = Route.useParams();

  const playlist = trpc.getPlaylist.useQuery(Number(playlistID), {
    retry: false,
  });
  const video = trpc.getVideo.useQuery(Number(videoID), {
    retry: false,
  });

  return (
    <>
      <article className="flex flex-col items-center px-8">
        <pre>{JSON.stringify(playlist.data, null, 2)}</pre>
        <pre>{JSON.stringify(video.data, null, 2)}</pre>

        <div className="hidden mt-8 sm:flex sm:justify-center sm:w-screen">
          {video.data && <ReactPlayer playing controls url={video.data.url} />}
        </div>
      </article>
    </>
  );
}
