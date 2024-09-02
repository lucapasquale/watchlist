import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "@ui/components/ui/skeleton";

import { PlaylistItemQueueSidebarDocument } from "~graphql/types";
import { Route } from "~routes/p/$playlistID/$videoID";

import { ItemsList } from "./items-list";

export function QueueSidebar() {
  const search = Route.useSearch();
  const { playlistID, videoID } = Route.useParams();

  const { data } = useQuery(PlaylistItemQueueSidebarDocument, {
    variables: { playlistID, shuffleSeed: search.shuffleSeed },
  });

  const currentItemIndex = React.useMemo(() => {
    if (!data) {
      return -1;
    }

    return data.playlist.items.findIndex((i) => i.id === videoID);
  }, [data, videoID]);

  if (!data) {
    return <Skeleton />;
  }

  return (
    <aside className="flex flex-col rounded-md bg-gray-700 max-h-[700px]">
      <div className="flex flex-col gap-2 p-4">
        <div>
          <Link
            to="/p/$playlistID"
            params={{ playlistID: playlistID.toString() }}
            className="text-xl font-bold"
          >
            {data.playlist.name}
          </Link>

          {search.shuffleSeed && <>- Shuffle</>}
        </div>

        {currentItemIndex > -1 && (
          <div>
            {currentItemIndex + 1} / {data.playlist.itemsCount}
          </div>
        )}
      </div>

      <ItemsList playlist={data.playlist} currentItemIndex={currentItemIndex} />
    </aside>
  );
}
