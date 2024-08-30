import ReactPlayer from "react-player/lazy";
import { useQuery } from "@apollo/client";
import { Skeleton } from "@ui/components/ui/skeleton";

import { Route } from "~routes/p/$playlistID/$videoID";

import { VideoToolbar } from "./video-toolbar";
import { PlaylistItemViewDocument } from "../../../../graphql/types";

export function VideoPlayer() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { playlistID, videoID } = Route.useParams();

  const { data } = useQuery(PlaylistItemViewDocument, {
    variables: { playlistItemID: videoID, shuffleSeed: search.shuffleSeed },
  });

  const onVideoEnded = () => {
    if (data?.playlistItem.nextItem) {
      navigate({
        to: "/p/$playlistID/$videoID",
        params: { playlistID, videoID: data.playlistItem.nextItem.id.toString() },
        search: true,
      });
    }
  };

  if (!data) {
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
        key={data.playlistItem.id}
        playing
        controls
        url={data.playlistItem.url}
        onEnded={onVideoEnded}
        onError={(...args) => {
          console.error("Failed to load video", ...args);
        }}
        width="100%"
        height="100%"
        style={{ aspectRatio: "16 / 9", maxHeight: "620px" }}
      />

      <VideoToolbar playlistItem={data.playlistItem} />
    </article>
  );
}
