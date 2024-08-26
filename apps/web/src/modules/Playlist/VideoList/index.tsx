import React from "react";
import {
  DragDropContext,
  Draggable,
  DraggableStyle,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

import { type RouterOutput, trpc } from "~utils/trpc";

import { AddVideo } from "./AddVideo";
import { getMoveInput, reorderList } from "./utils";
import { VideoItem } from "./VideoItem";

type Props = {
  playlistID: number;
  videos: NonNullable<RouterOutput["getPlaylistVideos"]>;
};

export function VideoList({ playlistID, videos }: Props) {
  const moveVideo = trpc.moveVideo.useMutation();

  const [videoList, setVideoList] = React.useState(videos);

  // TODO: use tailwind
  const getItemStyle = (isDragging: boolean, draggableStyle: DraggableStyle | undefined) =>
    ({
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      padding: 8 * 2,
      paddingLeft: 0,
      margin: `0 0 ${8}px 0`,

      // change background colour if dragging
      background: isDragging ? "lightgreen" : "grey",

      // styles we need to apply on draggables
      ...draggableStyle,
    }) as React.CSSProperties;

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
              className="w-full flex flex-col"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {videoList.map((video, index) => (
                <Draggable
                  key={video.id}
                  index={index}
                  draggableId={video.id.toString()}
                  isDragDisabled={moveVideo.isPending}
                >
                  {(provided, snapshot) => (
                    <VideoItem
                      video={video}
                      onDelete={() => onDelete(index)}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      dragHandleProps={provided.dragHandleProps}
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
