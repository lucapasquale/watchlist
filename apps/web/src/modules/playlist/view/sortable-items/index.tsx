import React from "react";
import { FixedSizeList } from "react-window";
import { useMutation, useQuery } from "@apollo/client";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { Skeleton } from "@ui/components/ui/skeleton";

import {
  MovePlaylistItemDocument,
  PlaylistItemFragFragment,
  PlaylistSortableItemsDocument,
  PlaylistViewDocument,
} from "~graphql/types";
import { Route } from "~routes/p/$playlistID/index.lazy";

import { PlaylistItem } from "./playlist-item";
import { getMoveInput, reorderList } from "./utils";

const ITEM_HEIGHT_PX = 130;

export function SortableItems() {
  const { playlistID } = Route.useParams();
  const [items, setItems] = React.useState<PlaylistItemFragFragment[]>([]);

  const { data } = useQuery(PlaylistSortableItemsDocument, {
    variables: { playlistID },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setItems(data.playlist.items);
    },
  });

  const [moveVideo, { loading }] = useMutation(MovePlaylistItemDocument, {
    refetchQueries: [PlaylistViewDocument],
    awaitRefetchQueries: true,
  });

  const onDragEnd = async (result: DropResult) => {
    const moveInput = getMoveInput(items, result);
    if (!result.destination || !moveInput) {
      return;
    }

    setItems(reorderList(items, result.source.index, result.destination.index));
    await moveVideo({ variables: { input: moveInput } });
  };

  const onDelete = (index: number) => {
    const updatedList = items.filter((_v, idx) => idx !== index);
    setItems(updatedList);
  };

  if (!data) {
    return (
      <div
        className="w-full overflow-y-scroll flex flex-col gap-2"
        style={{ maxHeight: ITEM_HEIGHT_PX * 5.5 }}
      >
        <Skeleton className="h-[122px] flex-none rounded-xl" />
        <Skeleton className="h-[122px] flex-none rounded-xl" />
        <Skeleton className="h-[122px] flex-none rounded-xl" />
        <Skeleton className="h-[122px] flex-none rounded-xl" />
        <Skeleton className="h-[122px] flex-none rounded-xl" />
        <Skeleton className="h-[122px] flex-none rounded-xl" />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable"
        mode="virtual"
        renderClone={(provided, snapshot, rubric) => (
          <PlaylistItem
            provided={provided}
            isDragging={snapshot.isDragging}
            item={items[rubric.source.index]}
          />
        )}
      >
        {(provided) => (
          <FixedSizeList
            itemData={items}
            itemCount={items.length}
            itemSize={ITEM_HEIGHT_PX}
            height={ITEM_HEIGHT_PX * 5.5}
            width="100%"
            outerRef={provided.innerRef}
          >
            {({ index, style }) => {
              const item = items[index];

              return (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  isDragDisabled={loading}
                >
                  {(provided) => (
                    <PlaylistItem
                      provided={provided}
                      item={item}
                      style={style}
                      onDelete={() => onDelete(index)}
                    />
                  )}
                </Draggable>
              );
            }}
          </FixedSizeList>
        )}
      </Droppable>
    </DragDropContext>
  );
}
