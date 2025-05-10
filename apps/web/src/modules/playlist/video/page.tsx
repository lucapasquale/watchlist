import { useQuery } from "@apollo/client";
import React from "react";

import { PlaylistItemViewDocument } from "~common/graphql-types.js";
import { useComponentSize } from "~common/hooks/use-component-size.js";
import { Route } from "~routes/p/$playlistID/$videoID.js";

import { QueueSidebar } from "./queue-sidebar/index.js";
import { VideoPlayer } from "./video-player/index.js";

export function Page() {
  const search = Route.useSearch();
  const { videoID } = Route.useParams();

  const playerSectionRef = React.useRef<HTMLElement>(null);
  const { height: playerSectionHeight } = useComponentSize(playerSectionRef);

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
      <VideoPlayer ref={playerSectionRef} playlistItem={data.playlistItem} />

      <aside className={`h-150px sm:h-[${playerSectionHeight}px]`}>
        <QueueSidebar playlist={data.playlistItem.playlist} />
      </aside>
    </main>
  );
}
