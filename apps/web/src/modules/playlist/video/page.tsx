import { QueueSidebar } from "./queue-sidebar";
import { VideoPlayer } from "./video-player";

export function Page() {
  return (
    <main className="grid grid-cols-1 xl:grid-cols-[2fr_minmax(min(350px,100%),_1fr)] gap-6">
      <VideoPlayer />

      <QueueSidebar />
    </main>
  );
}
