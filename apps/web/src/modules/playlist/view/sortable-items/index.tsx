import React from "react";
import { FixedSizeList } from "react-window";
import { useMutation } from "@apollo/client";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";

import { MovePlaylistItemDocument, PlaylistViewDocument, PlaylistViewQuery } from "~graphql/types";

import { PlaylistItem } from "./playlist-item";
import { getMoveInput, reorderList } from "./utils";

const ITEM_HEIGHT_PX = 132;

type Props = {
  playlist: PlaylistViewQuery["playlist"];
  isOwner: boolean;
};

export function SortableItems({ playlist, isOwner }: Props) {
  const [items, setItems] = React.useState(playlist.items);

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

  if (items.length === 0) {
    return <h4>No videos added to the playlist</h4>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable"
        mode="virtual"
        renderClone={(provided, snapshot, rubric) => (
          <PlaylistItem
            isOwner={isOwner}
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
            height={ITEM_HEIGHT_PX * 7.5}
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
                  isDragDisabled={!isOwner || loading}
                >
                  {(provided) => (
                    <PlaylistItem
                      provided={provided}
                      item={item}
                      style={style}
                      isOwner={isOwner}
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
