import { Link } from "@tanstack/react-router";
import { Shuffle } from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";

import { PlaylistItemViewQuery } from "~common/graphql-types.js";
import { Route } from "~routes/p/$playlistID/$videoID.js";

import { ItemsList } from "./items-list.js";

type Props = {
  playlist: PlaylistItemViewQuery["playlistItem"]["playlist"];
};

export function QueueSidebar({ playlist }: Props) {
  const search = Route.useSearch();
  const { playlistID, videoID } = Route.useParams();

  const currentItemIndex = React.useMemo(() => {
    return playlist.items.findIndex((i) => i.id === videoID);
  }, [playlist, videoID]);

  return (
    <Card className="bg-card flex w-full flex-col xl:max-h-[753px] xl:w-[400px] xl:min-w-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link
            to="/p/$playlistID"
            params={{ playlistID: playlistID.toString() }}
            className="text-2xl font-bold"
          >
            {playlist.name}
          </Link>

          {search.shuffleSeed && (
            <div className="bg-foreground rounded-lg p-2 text-base font-normal text-black">
              <Shuffle className="size-4" />
            </div>
          )}
        </CardTitle>

        <Link to="/u/$userID" params={{ userID: playlist.user.id }}>
          <CardDescription className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={playlist.user.profilePictureUrl ?? undefined} />
              <AvatarFallback>{playlist.user.initials}</AvatarFallback>
            </Avatar>

            {playlist.user.name}
          </CardDescription>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <ItemsList playlist={playlist} currentItemIndex={currentItemIndex} />
      </CardContent>
    </Card>
  );
}

QueueSidebar.Skeleton = () => <Skeleton className="h-[753px] w-[400px]" />;
