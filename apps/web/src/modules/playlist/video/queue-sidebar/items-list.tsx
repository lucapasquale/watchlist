import React from "react";
import { FixedSizeList } from "react-window";
import { Link } from "@tanstack/react-router";
import { cn } from "@ui/lib/utils";

import { type PlaylistItemQueueSidebarQuery } from "~graphql/types";
import { Route } from "~routes/p/$playlistID/$videoID";

const ITEM_HEIGHT_PX = 64;

type Props = {
  playlist: PlaylistItemQueueSidebarQuery["playlist"];
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
        const item = playlist.items[index];
        const isActive = index === currentItemIndex;

        return (
          <li
            key={item.id}
            style={style}
            className={cn(
              "absolute top-0 left-0 w-full px-2 py-1 hover:bg-gray-600 list-none",
              isActive && "bg-gray-600",
            )}
          >
            <Link
              search
              to="/p/$playlistID/$videoID"
              params={{
                playlistID: playlistID.toString(),
                videoID: item.id.toString(),
              }}
              className="flex items-center gap-3"
            >
              <p className="text-xs">{index + 1}</p>

              <img src={item.thumbnailUrl} className="w-[100px] h-[56px] aspect-video rounded-md" />

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
