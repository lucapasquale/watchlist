import React from "react";
import { GripVertical, LinkIcon, Trash } from "lucide-react";
import { useMutation } from "@apollo/client";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";

import { VideoKindBadge } from "~components/VideoKindBadge";

import {
  DeletePlaylistItemDocument,
  type PlaylistItemFragFragment,
} from "../../../../graphql/types";

type Props = React.ComponentProps<"li"> & {
  playlistItem: PlaylistItemFragFragment;
  onDelete: () => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
};

export const VideoItem = React.forwardRef<HTMLLIElement, Props>(
  ({ playlistItem, onDelete, dragHandleProps, className, ...liProps }, ref) => {
    const [deleteVideo] = useMutation(DeletePlaylistItemDocument);

    const onClickDelete = async () => {
      await deleteVideo({
        variables: { id: playlistItem.id },
      });
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
            <img src={playlistItem.thumbnailUrl} className="w-[160px] h-[90px] rounded-md" />

            <div className="flex flex-col gap-2">
              <h1 className="flex items-baseline gap-2 text-2xl">
                {playlistItem.title}

                <Link target="_blank" rel="noopener noreferrer" to={playlistItem.rawUrl}>
                  <LinkIcon className="size-4" />
                </Link>
              </h1>

              <VideoKindBadge kind={playlistItem.kind} />
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
