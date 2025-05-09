import { useQuery } from "@apollo/client";

import { PlaylistItemViewDocument } from "~common/graphql-types.js";
import { Route } from "~routes/p/$playlistID/$videoID.js";

import { QueueSidebar } from "./queue-sidebar/index.js";
import { VideoPlayer } from "./video-player/index.js";

export function Page() {
  const search = Route.useSearch();
  const { videoID } = Route.useParams();

  const { data } = useQuery(PlaylistItemViewDocument, {
    variables: { playlistItemID: videoID, shuffleSeed: search.shuffleSeed },
    fetchPolicy: "cache-and-network",
  });

  if (!data) {
    return (
      <main className="container mx-auto my-4 flex flex-col gap-6 px-2 sm:px-0 xl:flex-row">
        <VideoPlayer.Skeleton />

        <QueueSidebar.Skeleton />
      </main>
    );
  }

  return (
    <main className="container mx-auto my-4 flex flex-col gap-6 px-2 sm:px-0 xl:flex-row">
      <VideoPlayer playlistItem={data.playlistItem} />

      <aside>
        <QueueSidebar playlist={data.playlistItem.playlist} />
      </aside>
    </main>
  );
}
