import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";

import { PlaylistItemQueueSidebarDocument } from "~common/graphql-types.js";
import { Route } from "~routes/p/$playlistID/$videoID.js";

import { ItemsList } from "./items-list.js";

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

          {search.shuffleSeed && (
            <div className="text-base font-normal bg-white text-black rounded-lg px-2 py-0.5">
              Shuffle
            </div>
          )}
        </CardTitle>

        <Link to="/u/$userID" params={{ userID: data.playlist.user.id }}>
          <CardDescription className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={data.playlist.user.profilePictureUrl ?? undefined} />
              <AvatarFallback>{data.playlist.user.initials}</AvatarFallback>
            </Avatar>

            {data.playlist.user.name}
          </CardDescription>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <ItemsList playlist={data.playlist} currentItemIndex={currentItemIndex} />
      </CardContent>
    </Card>
  );
}

QueueSidebar.Skeleton = () => <Skeleton className="w-full" />;
