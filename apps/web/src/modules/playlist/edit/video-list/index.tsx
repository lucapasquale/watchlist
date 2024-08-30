import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";

import { Route } from "~routes/p/$playlistID/edit.lazy";

import {
  EditPlaylistDataDocument,
  MovePlaylistItemDocument,
  type PlaylistItemFragFragment,
} from "../../../../graphql/types";

import { AddVideo } from "./add-video";
import { getMoveInput, reorderList } from "./utils";
import { VideoItem } from "./video-item";

export function VideoList() {
  const { playlistID } = Route.useParams();

  const [itemList, setItemList] = React.useState<PlaylistItemFragFragment[]>([]);

  useQuery(EditPlaylistDataDocument, {
    variables: { playlistID },
    onCompleted: (data) => {
      setItemList(data.playlist.items);
    },
  });

  const [moveVideo, { loading }] = useMutation(MovePlaylistItemDocument);

  const onDragEnd = async (result: DropResult) => {
    const moveInput = getMoveInput(itemList, result);
    if (!result.destination || !moveInput) {
      return;
    }

    setItemList(reorderList(itemList, result.source.index, result.destination.index));
    await moveVideo({ variables: { input: moveInput } });
  };

  const onDelete = (index: number) => {
    const updatedList = itemList.filter((_v, idx) => idx !== index);
    setItemList(updatedList);
  };

  return (
    <article className="w-full flex flex-col items-center gap-8">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <ol
              {...provided.droppableProps}
              className="w-full flex flex-col"
              ref={provided.innerRef}
            >
              {itemList.map((item, index) => (
                <Draggable
                  key={item.id}
                  index={index}
                  draggableId={item.id.toString()}
                  isDragDisabled={loading}
                >
                  {(provided) => (
                    <VideoItem
                      playlistItem={item}
                      onDelete={() => onDelete(index)}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      style={provided.draggableProps.style}
                      dragHandleProps={provided.dragHandleProps}
                      className="mb-4"
                    />
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </ol>
          )}
        </Droppable>
      </DragDropContext>

      <AddVideo onAdd={(newVideo) => setItemList((v) => [...v, newVideo])} />
    </article>
  );
}
