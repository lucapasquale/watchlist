import React from "react";
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

import { PlaylistItemViewQuery } from "~common/graphql-types.js";
import { Route } from "~routes/p/$playlistID/$videoID.js";

import { ItemsList } from "./items-list.js";
import { Shuffle } from "lucide-react";

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
    <Card className="flex flex-col bg-card w-full xl:min-w-[400px] xl:w-[400px] xl:max-h-[753px]">
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
            <div className="text-base font-normal bg-foreground text-black rounded-lg p-2">
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

QueueSidebar.Skeleton = () => <Skeleton className="w-[400px] h-[753px]" />;
