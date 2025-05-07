import React from "react";
import { useMutation } from "@apollo/client";
import { Skeleton } from "@ui/components/ui/skeleton.js";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";

import {
  MovePlaylistItemDocument,
  PlaylistViewDocument,
  PlaylistViewQuery,
} from "~common/graphql-types.js";

import { PlaylistItem } from "./playlist-item.js";
import { reorderList } from "./utils.js";
import {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types.js";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"; // NEW

type Props = {
  playlist: PlaylistViewQuery["playlist"];
  isOwner: boolean;
};

export function SortableItems({ playlist, isOwner }: Props) {
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

      const sortedItems = reorderList(items, startIndex, destinationIndex);
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
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <PlaylistItem
          key={item.id}
          index={index}
          item={item}
          isOwner={isOwner}
          onDelete={() => onDelete(index)}
        />
      ))}
    </div>
  );
}

SortableItems.Skeleton = () => (
  <section className="w-full h-[975px] overflow-y-scroll flex flex-col gap-2">
    <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
    <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
    <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
    <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
    <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
    <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
    <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
    <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
  </section>
);
