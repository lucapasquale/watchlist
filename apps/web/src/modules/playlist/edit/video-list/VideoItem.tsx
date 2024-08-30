import React from "react";
import { GripVertical, LinkIcon, Trash } from "lucide-react";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";

import { VideoKindBadge } from "~components/VideoKindBadge";
import { RouterOutput, trpc } from "~utils/trpc";

type Props = React.ComponentProps<"li"> & {
  video: NonNullable<RouterOutput["getPlaylistItems"]>[number];
  onDelete: () => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
};

export const VideoItem = React.forwardRef<HTMLLIElement, Props>(
  ({ video, onDelete, dragHandleProps, className, ...liProps }, ref) => {
    const deleteVideo = trpc.deletePlaylistItem.useMutation();

    const onClickDelete = async () => {
      await deleteVideo.mutateAsync(video.id);
      onDelete();
    };

    return (
      <li
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-8 rounded-xl bg-slate-800 pr-4",
          className,
        )}
        {...liProps}
      >
        <div className="flex items-center">
          <div {...dragHandleProps} className="flex flex-row items-center self-stretch px-4">
            <GripVertical className="size-4" />
          </div>

          <div className="flex items-center gap-2 py-4">
            <img src={video.thumbnail_url} className="w-[160px] h-[90px] rounded-md" />

            <div className="flex flex-col gap-2">
              <h1 className="flex items-baseline gap-2 text-2xl">
                {video.title}

                <Link target="_blank" rel="noopener noreferrer" to={video.raw_url}>
                  <LinkIcon className="size-4" />
                </Link>
              </h1>

              <VideoKindBadge videoKind={video.kind} />
            </div>
          </div>
        </div>

        <Button variant="destructive" onClick={onClickDelete}>
          <Trash className="size-4" />
        </Button>
      </li>
    );
  },
);
