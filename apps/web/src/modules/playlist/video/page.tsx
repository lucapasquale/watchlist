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
  });

  if (!data) {
    return (
      <main className="my-4 flex flex-col xl:flex-row gap-6">
        <VideoPlayer.Skeleton />

        <QueueSidebar.Skeleton />
      </main>
    );
  }

  return (
    <main className="my-4 flex flex-col xl:flex-row gap-6">
      <VideoPlayer playlistItem={data.playlistItem} />

      <aside>
        <QueueSidebar />
      </aside>
    </main>
  );
}
