import ReactPlayer from "react-player/lazy";

import { Link } from "~components/Link";
import { RouterOutput } from "~utils/trpc";

type Props = {
  videoData: RouterOutput["getVideo"];
  onVideoEnded: () => void;
};

export function VideoPlayer({ videoData, onVideoEnded }: Props) {
  return (
    <article className="w-[640px] h-[360px] flex flex-col gap-6">
      <ReactPlayer
        key={videoData.video.id}
        playing
        controls
        url={videoData.video.url}
        onEnded={onVideoEnded}
      />

      <div className="flex w-full justify-between gap-8">
        {videoData?.metadata.previousVideoID ? (
          <Link to={`../${videoData?.metadata.previousVideoID}`}>Previous</Link>
        ) : (
          <div />
        )}
        {videoData?.metadata.nextVideoID ? (
          <Link to={`../${videoData?.metadata.nextVideoID}`}>Next</Link>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}
