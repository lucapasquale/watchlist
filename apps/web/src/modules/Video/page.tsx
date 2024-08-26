import { Route } from "~routes/playlists/$playlistID/$videoID";

import { QueueSidebar } from "./QueueSidebar";
import { VideoPlayer } from "./VideoPlayer";

export function Page() {
  const { playlistID, videoID } = Route.useParams();

  return (
    <section className="grid grid-cols-[2fr_1fr] gap-x-6">
      <VideoPlayer videoID={Number(videoID)} />

      <QueueSidebar playlistID={Number(playlistID)} />
    </section>
  );
}
