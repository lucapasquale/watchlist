import ReactPlayer from "react-player/lazy";

import { Link } from "~components/Link";
import { Route } from "~routes/playlists/$playlistID/$videoID.lazy";
import { RouterOutput, trpc } from "~utils/trpc";

type Props = {
  video: NonNullable<RouterOutput["getVideo"]>;
};

export function VideoPlayer({ video }: Props) {
  const navigate = Route.useNavigate();
  const metadata = trpc.getPlaylistMetadata.useQuery(video.id);

  const onVideoEnded = () => {
    if (metadata.data?.nextVideoID) {
      navigate({ to: `../${metadata.data.nextVideoID.toString()}` });
    }
  };

  return (
    <article className="w-[640px] h-[360px] flex flex-col gap-6">
      <ReactPlayer key={video.id} playing controls url={video.url} onEnded={onVideoEnded} />

      <div className="flex w-full justify-between gap-8">
        {metadata.data?.previousVideoID ? (
          <Link to={`../${metadata.data?.previousVideoID}`}>Previous</Link>
        ) : (
          <div />
        )}

        {metadata.data?.nextVideoID ? (
          <Link to={`../${metadata.data?.nextVideoID}`}>Next</Link>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}
