import { Link } from "@tanstack/react-router";

import { Route } from "~routes/p/$playlistID/edit.lazy";
import { trpc } from "~utils/trpc";

import { VideoList } from "./video-list";

export function Page() {
  const { playlistID } = Route.useParams();

  const playlistVideos = trpc.getPlaylistItems.useQuery(Number(playlistID));
  if (!playlistVideos.data) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col items-center px-8 gap-40">
      <Link to="/p/$playlistID" params={{ playlistID }}>
        Back
      </Link>

      <VideoList playlistID={Number(playlistID)} videos={playlistVideos.data} />
    </section>
  );
}
