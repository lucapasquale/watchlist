import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
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
    <Card className="flex flex-col rounded-md bg-card w-full xl:min-w-[400px] xl:w-[400px] xl:max-h-[753px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link
            to="/p/$playlistID"
            params={{ playlistID: playlistID.toString() }}
            className="text-2xl font-bold"
          >
            {data.playlist.name}
          </Link>
        </CardTitle>

        <CardDescription>
          {currentItemIndex + 1} / {data.playlist.itemsCount}
          {search.shuffleSeed && <span> - Shuffle</span>}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <ItemsList playlist={data.playlist} currentItemIndex={currentItemIndex} />
      </CardContent>
    </Card>
  );
}
