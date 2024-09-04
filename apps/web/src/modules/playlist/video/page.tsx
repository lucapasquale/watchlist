import { QueueSidebar } from "./queue-sidebar";
import { VideoPlayer } from "./video-player";

export function Page() {
  return (
    <main className="flex flex-col xl:flex-row gap-6">
      <VideoPlayer />

      <QueueSidebar />
    </main>
  );
}
