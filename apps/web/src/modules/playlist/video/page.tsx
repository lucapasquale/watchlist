import { useQuery } from "@apollo/client";

import { PlaylistItemViewDocument } from "~common/graphql-types";
import { Route } from "~routes/p/$playlistID/$videoID";

import { QueueSidebar } from "./queue-sidebar";
import { VideoPlayer } from "./video-player";

export function Page() {
  const search = Route.useSearch();
  const { videoID } = Route.useParams();

  const { data } = useQuery(PlaylistItemViewDocument, {
    variables: { playlistItemID: videoID, shuffleSeed: search.shuffleSeed },
  });

  if (!data) {
    return (
      <main className="flex flex-col xl:flex-row gap-6">
        <VideoPlayer.Skeleton />

        <QueueSidebar.Skeleton />
      </main>
    );
  }

  return (
    <main className="flex flex-col xl:flex-row gap-6">
      <VideoPlayer playlistItem={data.playlistItem} />

      <QueueSidebar />
    </main>
  );
}
