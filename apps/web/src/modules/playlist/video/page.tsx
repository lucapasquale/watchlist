import { QueueSidebar } from "./queue-sidebar";
import { VideoPlayer } from "./video-player";

export function Page() {
  return (
    <section className="grid grid-cols-[2fr_1fr] gap-x-6">
      <VideoPlayer />

      <QueueSidebar />
    </section>
  );
}
