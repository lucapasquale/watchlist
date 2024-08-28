import ReactPlayer from "react-player/lazy";
import { Skeleton } from "@ui/components/ui/skeleton";

import { Route } from "~routes/p/$playlistID/$videoID";
import { RouterOutput, trpc } from "~utils/trpc";

import { VideoToolbar } from "./WatchControls";

type Props = {
  videoID: number;
  queue: RouterOutput["getPlaylistQueue"] | undefined;
};

export function VideoPlayer({ videoID, queue }: Props) {
  const navigate = Route.useNavigate();

  const video = trpc.getPlaylistItem.useQuery(videoID);

  const onVideoEnded = () => {
    if (queue?.[0]) {
      navigate({ to: `../${queue[0].id.toString()}`, search: true });
    }
  };

  if (!video.data) {
    return (
      <article className="flex flex-col gap-6">
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="h-[62px]" />
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-6">
      <ReactPlayer
        key={video.data.id}
        playing
        controls
        url={video.data.url}
        onEnded={onVideoEnded}
        onError={onVideoEnded}
        width="100%"
        height="100%"
        style={{ aspectRatio: "16 / 9", maxHeight: "620px" }}
      />

      <VideoToolbar video={video.data} queue={queue} />
    </article>
  );
}
