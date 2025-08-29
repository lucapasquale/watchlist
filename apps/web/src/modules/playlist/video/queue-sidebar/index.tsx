import { Link } from "@tanstack/react-router";
import { Shuffle } from "lucide-react";
import React from "react";
import { List, useListRef } from "react-window";

import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";
import { Toggle } from "@ui/components/ui/toggle.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip.js";
import { cn } from "@ui/lib/utils";

import { PlaylistItemViewQuery } from "~common/graphql-types.js";
import { Route } from "~routes/playlist/$playlistID/$videoID.js";

import { PlaylistItem } from "./playlist-item";

const ITEM_HEIGHT_PX = 64;

type Props = {
  playlist: PlaylistItemViewQuery["playlistItem"]["playlist"];
};

export function QueueSidebar({ playlist }: Props) {
  const search = Route.useSearch();
  const { playlistID, videoID } = Route.useParams();

  const listRef = useListRef(null);

  const currentItemIndex = React.useMemo(() => {
    return playlist.items.findIndex((i) => i.id === videoID);
  }, [playlist, videoID]);

  React.useEffect(() => {
    if (currentItemIndex <= -1 || !listRef.current) {
      return;
    }

    listRef.current.scrollToRow({
      index: currentItemIndex,
      align: "start",
      behavior: "smooth",
    });
  }, [listRef, currentItemIndex]);

  return (
    <Card
      className={cn(
        "bg-card flex w-full flex-col gap-2 overflow-hidden py-4 pb-0 sm:gap-4 sm:pt-6 xl:w-[400px] xl:min-w-[400px]",
        "h-[calc(100dvh_-72px_-8px_var(--player-section-height)_-8px)]",
      )}
    >
      <CardHeader>
        <CardTitle className="grid grid-cols-[1fr_32px] items-center justify-between gap-2">
          <Link
            title={playlist.name}
            to="/playlist/$playlistID"
            params={{ playlistID: playlistID.toString() }}
            className="line-clamp-1 text-2xl font-bold leading-relaxed"
          >
            {playlist.name}
          </Link>

          <TooltipProvider>
            <Tooltip delayDuration={250}>
              <TooltipTrigger asChild>
                <Link
                  to="."
                  search={(prev) => ({
                    ...prev,
                    shuffleSeed: search.shuffleSeed ? undefined : Date.now().toString(),
                  })}
                >
                  <Toggle size="sm" aria-label="shuffle" pressed={!!search.shuffleSeed}>
                    <Shuffle className="size-4" />
                  </Toggle>
                </Link>
              </TooltipTrigger>

              <TooltipContent>
                <p>Shuffle playlist</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>

        <Link to="/user/$userID" params={{ userID: playlist.user.id }}>
          <CardDescription className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={playlist.user.profilePictureUrl ?? undefined} />
              <AvatarFallback>{playlist.user.initials}</AvatarFallback>
            </Avatar>
            by {playlist.user.name}
          </CardDescription>
        </Link>
      </CardHeader>

      <CardContent
        className={cn(
          "p-0",
          "h-[calc(100dvh_-72px_-8px_-var(--player-section-height)_-8px_-16px_-69px)] p-0 sm:h-[calc(var(--player-section-height)_-24px_-69px_-16px)]",
        )}
      >
        <List
          listRef={listRef}
          overscanCount={10}
          rowCount={playlist.items.length}
          rowHeight={ITEM_HEIGHT_PX}
          rowComponent={PlaylistItem}
          rowProps={{ items: playlist.items, currentItemIndex, playlistID }}
        />
      </CardContent>
    </Card>
  );
}

QueueSidebar.Skeleton = () => <Skeleton className="h-[753px] w-[400px]" />;
