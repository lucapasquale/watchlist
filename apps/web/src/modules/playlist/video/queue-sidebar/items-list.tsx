import { Link } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import React from "react";
import { FixedSizeList } from "react-window";

import { PlaylistItemViewQuery } from "~common/graphql-types.js";
import { Route } from "~routes/p/$playlistID/$videoID.js";

const ITEM_HEIGHT_PX = 64;

type Props = {
  playlist: PlaylistItemViewQuery["playlistItem"]["playlist"];
  currentItemIndex: number;
};

export function ItemsList({ playlist, currentItemIndex }: Props) {
  const { playlistID } = Route.useParams();

  const parentRef = React.useRef<FixedSizeList>(null);

  React.useEffect(() => {
    if (currentItemIndex <= -1 || !parentRef.current) {
      return;
    }

    parentRef.current.scrollToItem(currentItemIndex, "start");
  }, [currentItemIndex]);

  return (
    <FixedSizeList
      ref={parentRef}
      itemCount={playlist.items.length}
      itemSize={ITEM_HEIGHT_PX}
      height={650}
      width="100%"
    >
      {({ index, style }) => {
        const item = playlist.items[index]!;
        const isActive = index === currentItemIndex;

        return (
          <li
            key={item.id}
            style={style}
            className={cn(
              "hover:bg-primary/70 absolute left-0 top-0 w-full list-none px-2 py-1",
              isActive && "bg-primary",
            )}
          >
            <Link
              search
              to="/p/$playlistID/$videoID"
              params={{
                playlistID: playlistID.toString(),
                videoID: item.id.toString(),
              }}
              className="flex items-center gap-3 hover:no-underline"
            >
              <p className="min-w-[26px] text-center text-xs">{index + 1}</p>

              <img src={item.thumbnailUrl} className="aspect-video h-[56px] w-[100px] rounded-md" />

              <h1 title={item.title} className={cn("line-clamp-2", isActive && "font-bold")}>
                {item.title}
              </h1>
            </Link>
          </li>
        );
      }}
    </FixedSizeList>
  );
}
