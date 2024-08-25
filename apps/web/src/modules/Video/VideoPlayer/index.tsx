import ReactPlayer from "react-player/lazy";

import { Route } from "~routes/playlists/$playlistID/$videoID";
import { RouterOutput, trpc } from "~utils/trpc";

import { WatchControls } from "./WatchControls";

type Props = {
  video: NonNullable<RouterOutput["getVideo"]>;
};

export function VideoPlayer({ video }: Props) {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const metadata = trpc.getPlaylistMetadata.useQuery({
    videoID: video.id,
    shuffle: search.shuffle ?? false,
  });

  const onVideoEnded = () => {
    if (metadata.data?.nextVideoID) {
      navigate({ to: `../${metadata.data.nextVideoID.toString()}`, search: true });
    }
  };

  return (
    <article className="w-[640px] h-[360px] flex flex-col gap-6">
      <ReactPlayer key={video.id} playing controls url={video.url} onEnded={onVideoEnded} />

      <WatchControls video={video} metadata={metadata.data} />
    </article>
  );
}
