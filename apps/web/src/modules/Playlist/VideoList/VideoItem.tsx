import React from "react";
import { GripVertical, Trash } from "lucide-react";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Button } from "@ui/components/ui/button";

import { RouterOutput, trpc } from "~utils/trpc";

type Props = React.ComponentProps<"li"> & {
  video: NonNullable<RouterOutput["getPlaylistVideos"]>[number];
  onDelete: () => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
};

export const VideoItem = React.forwardRef<HTMLLIElement, Props>(
  ({ video, onDelete, dragHandleProps, ...liProps }, ref) => {
    const deleteVideo = trpc.deleteVideo.useMutation();

    const onClickDelete = async () => {
      await deleteVideo.mutateAsync(video.id);
      onDelete();
    };

    return (
      <li ref={ref} className="flex items-center justify-between gap-8" {...liProps}>
        <div className="flex items-center gap-2">
          <div {...dragHandleProps}>
            <GripVertical className="h-4 w-4" />
          </div>

          <img src={video.thumbnail_url} className="w-[160px] h-[90px]" />

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl">{video.title}</h2>
            <h4>{video.kind}</h4>
          </div>
        </div>

        <Button variant="destructive" onClick={onClickDelete}>
          <Trash className="h-4 w-4" />
        </Button>
      </li>
    );
  },
);
