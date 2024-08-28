import { Route } from "~routes/playlists/$playlistID/$videoID";
import { trpc } from "~utils/trpc";

import { QueueSidebar } from "./QueueSidebar";
import { VideoPlayer } from "./VideoPlayer";

export function Page() {
  const search = Route.useSearch();
  const { playlistID, videoID } = Route.useParams();

  const queue = trpc.getPlaylistQueue.useQuery({
    currentItemID: Number(videoID),
    shuffleSeed: search.shuffleSeed,
  });

  return (
    <section className="grid grid-cols-[2fr_1fr] gap-x-6">
      <VideoPlayer videoID={Number(videoID)} queue={queue.data} />

      <QueueSidebar playlistID={Number(playlistID)} queue={queue.data} />
    </section>
  );
}
