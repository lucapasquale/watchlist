import React from "react";
import { Link } from "@tanstack/react-router";
import { elementScroll, useVirtualizer, VirtualizerOptions } from "@tanstack/react-virtual";
import { cn } from "@ui/lib/utils";

import { type PlaylistItemQueueSidebarQuery } from "~graphql/types";
import { Route } from "~routes/p/$playlistID/$videoID";

type Props = {
  playlist: PlaylistItemQueueSidebarQuery["playlist"];
  currentItemIndex: number;
};

export function ItemsList({ playlist, currentItemIndex }: Props) {
  const { playlistID } = Route.useParams();

  const parentRef = React.useRef<HTMLDivElement>(null);
  const scrollingRef = React.useRef<number>();

  const scrollToFn: VirtualizerOptions<HTMLDivElement, HTMLLIElement>["scrollToFn"] =
    React.useCallback((offset, canSmooth, instance) => {
      const duration = 250;
      const start = parentRef.current?.scrollTop || 0;
      const startTime = (scrollingRef.current = Date.now());

      const run = () => {
        if (scrollingRef.current !== startTime) {
          return;
        }

        const now = Date.now();
        const elapsed = now - startTime;
        const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
        const interpolated = start + (offset - start) * progress;

        if (elapsed < duration) {
          elementScroll(interpolated, canSmooth, instance);
          requestAnimationFrame(run);
        } else {
          elementScroll(interpolated, canSmooth, instance);
        }
      };

      requestAnimationFrame(run);
    }, []);

  const rowVirtualizer = useVirtualizer({
    count: playlist.items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
    scrollToFn,
  });

  React.useEffect(() => {
    if (currentItemIndex <= -1) {
      return;
    }

    rowVirtualizer.scrollToIndex(currentItemIndex, { align: "start", behavior: "smooth" });
  }, [currentItemIndex, rowVirtualizer]);

  return (
    <div ref={parentRef} className="h-[650px] overflow-x-hidden overflow-y-auto">
      <ol className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const playlistItem = playlist.items[virtualItem.index];
          const isActive = virtualItem.index === currentItemIndex;

          return (
            <li
              key={virtualItem.index}
              className={cn(
                "absolute top-0 left-0 w-full px-2 py-1 hover:bg-gray-600",
                isActive && "bg-gray-600",
              )}
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <Link
                search
                to="/p/$playlistID/$videoID"
                params={{
                  playlistID: playlistID.toString(),
                  videoID: playlistItem.id.toString(),
                }}
                className="flex items-center gap-3"
              >
                <p className="text-xs">{virtualItem.index + 1}</p>

                <img
                  src={playlistItem.thumbnailUrl}
                  className="w-[100px] h-[56px] aspect-video rounded-md"
                />

                <h1
                  title={playlistItem.title}
                  className={cn("line-clamp-2", isActive && "font-bold")}
                >
                  {playlistItem.title}
                </h1>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}
