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
import { useComponentSize } from "@ui/hooks/use-component-size.js";
import { cn } from "@ui/lib/utils.js";

import { PlaylistItemViewQuery } from "~common/graphql-types.js";
import { Route } from "~routes/p/$playlistID/$videoID.js";

import { ItemsList } from "./items-list.js";

type Props = {
  playlist: PlaylistItemViewQuery["playlistItem"]["playlist"];
};

export function QueueSidebar({ playlist }: Props) {
  const search = Route.useSearch();
  const { playlistID, videoID } = Route.useParams();

  const cardRef = React.useRef<HTMLDivElement>(null);
  const { height: cardHeight } = useComponentSize(cardRef);

  const currentItemIndex = React.useMemo(() => {
    return playlist.items.findIndex((i) => i.id === videoID);
  }, [playlist, videoID]);

  return (
    <Card
      ref={cardRef}
      className="bg-card flex h-[calc(100vh_-500px)] w-full flex-col overflow-y-clip pb-0 sm:h-full xl:w-[400px] xl:min-w-[400px]"
    >
      <CardHeader>
        <CardTitle
          title={playlist.name}
          className={cn(
            "grid grid-cols-1 items-center justify-between gap-2",
            search.shuffleSeed && "grid-cols-[1fr_32px]",
          )}
        >
          <Link
            to="/p/$playlistID"
            params={{ playlistID: playlistID.toString() }}
            className="line-clamp-1 text-2xl font-bold"
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
            by {playlist.user.name}
          </CardDescription>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <ItemsList
          playlist={playlist}
          currentItemIndex={currentItemIndex}
          listHeight={Math.min(cardHeight - 62 - 24 - 24, 640)} // 62 = header height, 24 = gap, 24 = margin-top
        />
      </CardContent>
    </Card>
  );
}

QueueSidebar.Skeleton = () => <Skeleton className="h-[753px] w-[400px]" />;
