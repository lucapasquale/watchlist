import ReactPlayer from "react-player/lazy";
import { Skeleton } from "@ui/components/ui/skeleton";

import { Route } from "~routes/playlists/$playlistID/$videoID";
import { trpc } from "~utils/trpc";

import { VideoToolbar } from "./WatchControls";

type Props = {
  videoID: number;
};

export function VideoPlayer({ videoID }: Props) {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const video = trpc.getVideo.useQuery(videoID);
  const metadata = trpc.getPlaylistMetadata.useQuery({
    videoID,
    shuffle: search.shuffle ?? false,
  });

  const onVideoEnded = () => {
    if (metadata.data?.nextVideoID) {
      navigate({ to: `../${metadata.data.nextVideoID.toString()}`, search: true });
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
        width="100%"
        height="100%"
        style={{ aspectRatio: "16 / 9", maxHeight: "620px" }}
      />

      <VideoToolbar video={video.data} metadata={metadata.data} />
    </article>
  );
}
