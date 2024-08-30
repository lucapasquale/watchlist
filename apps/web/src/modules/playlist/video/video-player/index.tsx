import ReactPlayer from "react-player/lazy";
import { useQuery } from "@apollo/client";
import { Skeleton } from "@ui/components/ui/skeleton";

import { Route } from "~routes/p/$playlistID/$videoID";

import { gql } from "../../../../__generated__";

import { VideoToolbar } from "./video-toolbar";

const PLAYLIST_ITEM_VIEW_QUERY = gql(/* GraphQL */ `
  query PlaylistItemView($playlistItemID: ID!) {
    playlistItem(id: $playlistItemID) {
      id
      kind
      title
      thumbnailUrl
      url
      rawUrl
    }
  }
`);

export function VideoPlayer() {
  // const search = Route.useSearch();
  // const navigate = Route.useNavigate();
  const { videoID } = Route.useParams();

  const { data } = useQuery(PLAYLIST_ITEM_VIEW_QUERY, {
    variables: { playlistItemID: videoID },
  });

  const onVideoEnded = () => {
    // if (queue?.[0]) {
    //   navigate({ to: `../${queue[0].id.toString()}`, search: true });
    // }
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
