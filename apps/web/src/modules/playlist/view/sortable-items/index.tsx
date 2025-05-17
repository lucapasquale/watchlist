import { useMutation } from "@apollo/client";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types.js";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import React from "react";
import { FixedSizeList } from "react-window";

import { Skeleton } from "@ui/components/ui/skeleton.js";
import { useComponentSize } from "@ui/hooks/use-component-size.js";

import {
  MovePlaylistItemDocument,
  PlaylistViewDocument,
  PlaylistViewQuery,
} from "~common/graphql-types.js";

import { PlaylistItem } from "./playlist-item.js";

const ITEM_HEIGHT_PX = 110;

type Props = {
  playlist: PlaylistViewQuery["playlist"];
  isOwner: boolean;
};

export function SortableItems({ playlist, isOwner }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { height: cardHeight } = useComponentSize(containerRef);

  const [items, setItems] = React.useState(playlist.items);

  const [moveVideo] = useMutation(MovePlaylistItemDocument, {
    refetchQueries: [PlaylistViewDocument],
    awaitRefetchQueries: true,
  });

  const handleDrop = React.useCallback(
    async ({ source, location }: BaseEventPayload<ElementDragType>) => {
      const itemID = source.data.id as string;
      const startIndex = items.findIndex((i) => i.id === itemID);
      const indexOfTarget = items.findIndex(
        (i) => i.id === location.current.dropTargets[0]?.data.id,
      );

      const closestEdgeOfTarget = extractClosestEdge(location.current.dropTargets[0]?.data);
      const destinationIndex = getReorderDestinationIndex({
        startIndex,
        indexOfTarget,
        closestEdgeOfTarget,
        axis: "vertical",
      });

      if (startIndex === destinationIndex) {
        return;
      }

      const sortedItems = reorder({ list: items, startIndex, finishIndex: destinationIndex });
      setItems(sortedItems);

      const beforeItem = destinationIndex === 0 ? null : sortedItems[destinationIndex - 1];
      await moveVideo({
        variables: { input: { id: itemID, beforeID: beforeItem?.id } },
      });
    },
    [items, moveVideo],
  );

  const onDelete = (index: number) => {
    const updatedList = items.filter((_v, idx) => idx !== index);
    setItems(updatedList);
  };

  React.useEffect(() => {
    return monitorForElements({
      onDrop: handleDrop,
    });
  }, [handleDrop]);

  if (items.length === 0) {
    return <h4>No videos added to the playlist</h4>;
  }

  return (
    <div ref={containerRef} className="h-[calc(100dvh_-_402px)]">
      <FixedSizeList
        itemData={items}
        itemCount={items.length}
        itemSize={ITEM_HEIGHT_PX}
        height={cardHeight}
        width="100%"
        innerElementType={innerElementType}
      >
        {({ index, style }) => {
          const item = items[index];

          return (
            <PlaylistItem
              key={item.id}
              index={index}
              item={item}
              isOwner={isOwner}
              onDelete={() => onDelete(index)}
              style={{
                ...style,
                top: parseFloat(style.top as string) + 8 * index,
              }}
            />
          );
        }}
      </FixedSizeList>
    </div>
  );
}

const innerElementType = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ ...props }, ref) => <div ref={ref} className="relative px-2 md:top-2" {...props} />,
);

SortableItems.Skeleton = () => (
  <section className="flex h-[975px] w-full flex-col gap-2 overflow-y-scroll">
    <Skeleton className="bg-card h-[122px] flex-none rounded-xl" />
    <Skeleton className="bg-card h-[122px] flex-none rounded-xl" />
    <Skeleton className="bg-card h-[122px] flex-none rounded-xl" />
    <Skeleton className="bg-card h-[122px] flex-none rounded-xl" />
    <Skeleton className="bg-card h-[122px] flex-none rounded-xl" />
    <Skeleton className="bg-card h-[122px] flex-none rounded-xl" />
    <Skeleton className="bg-card h-[122px] flex-none rounded-xl" />
    <Skeleton className="bg-card h-[122px] flex-none rounded-xl" />
  </section>
);
