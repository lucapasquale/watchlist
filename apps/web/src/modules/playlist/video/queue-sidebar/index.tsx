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
import { Toggle } from "@ui/components/ui/toggle.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip.js";
import { useComponentSize } from "@ui/hooks/use-component-size.js";

import { PlaylistItemViewQuery } from "~common/graphql-types.js";
import { Route } from "~routes/playlist/$playlistID/$videoID.js";

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
      className="bg-card flex h-[calc(100dvh_-_446px)] w-full flex-col gap-2 overflow-y-clip py-4 pb-0 sm:h-full sm:gap-4 sm:py-6 xl:w-[400px] xl:min-w-[400px]"
    >
      <CardHeader>
        <CardTitle className="grid grid-cols-[1fr_32px] items-center justify-between gap-2">
          <Link
            title={playlist.name}
            to="/playlist/$playlistID"
            params={{ playlistID: playlistID.toString() }}
            className="line-clamp-1 text-2xl font-bold"
          >
            {playlist.name}
          </Link>

          <TooltipProvider>
            <Tooltip>
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
