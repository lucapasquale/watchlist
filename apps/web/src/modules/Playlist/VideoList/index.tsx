import React from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";

import { type RouterOutput, trpc } from "~utils/trpc";

import { AddVideo } from "./AddVideo";
import { getMoveInput, reorderList } from "./utils";
import { VideoItem } from "./VideoItem";

type Props = {
  playlistID: number;
  videos: NonNullable<RouterOutput["getPlaylistItems"]>;
};

export function VideoList({ playlistID, videos }: Props) {
  const moveVideo = trpc.movePlaylistItem.useMutation();

  const [videoList, setVideoList] = React.useState(videos);

  const onDragEnd = async (result: DropResult) => {
    const moveInput = getMoveInput(videos, result);
    if (!result.destination || !moveInput) {
      return;
    }

    setVideoList(reorderList(videoList, result.source.index, result.destination.index));
    await moveVideo.mutateAsync(moveInput);
  };

  const onDelete = (index: number) => {
    const updatedList = videoList.filter((_v, idx) => idx !== index);
    setVideoList(updatedList);
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
              {videoList.map((video, index) => (
                <Draggable
                  key={video.id}
                  index={index}
                  draggableId={video.id.toString()}
                  isDragDisabled={moveVideo.isPending}
                >
                  {(provided) => (
                    <VideoItem
                      video={video}
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

      <AddVideo
        playlistID={playlistID}
        onAdd={(newVideo) => setVideoList((v) => [...v, newVideo])}
      />
    </article>
  );
}
