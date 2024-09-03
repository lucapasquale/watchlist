import { GripVertical, LinkIcon, Trash } from "lucide-react";
import { useMutation } from "@apollo/client";
import { DraggableProvided } from "@hello-pangea/dnd";
import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";

import { PlaylistItemKindBadge } from "~components/playlist-item-kind-badge";
import {
  DeletePlaylistItemDocument,
  type PlaylistSortableItemsQuery,
  PlaylistViewDocument,
} from "~graphql/types";

type Props = {
  item: PlaylistSortableItemsQuery["playlist"]["items"][number];
  onDelete?: () => void;
  provided: DraggableProvided;
  isDragging?: boolean;
  style?: React.CSSProperties;
};

export function PlaylistItem({ item, onDelete, provided, style, isDragging }: Props) {
  const [deleteVideo] = useMutation(DeletePlaylistItemDocument, {
    refetchQueries: [PlaylistViewDocument],
    awaitRefetchQueries: true,
  });

  const onClickDelete = async () => {
    await deleteVideo({
      variables: { id: item.id },
    });
    onDelete?.();
  };

  const getStyle = ({
    provided,
    style,
    isDragging,
  }: Pick<Props, "provided" | "style" | "isDragging">) => {
    const combined = {
      ...style,
      ...provided.draggableProps.style,
    };

    const height = combined.height as number;
    const marginBottom = 8;

    return {
      ...combined,
      marginBottom,
      height: isDragging ? height : height - marginBottom,
    };
  };

  return (
    <li
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={getStyle({ provided, style, isDragging })}
      className={cn(
        "flex items-center justify-between gap-8 rounded-xl bg-slate-800 pr-4 text-primary list-none",
        isDragging && "bg-slate-600",
      )}
    >
      <div className="flex items-center">
        <div className="flex flex-row items-center self-stretch px-4">
          <GripVertical className="size-4" />
        </div>

        <div className="flex items-center gap-2 py-4">
          <img src={item.thumbnailUrl} className="w-[160px] h-[90px] rounded-md" />

          <div className="flex flex-col gap-2">
            <h1 className="flex items-baseline gap-2 text-2xl">
              {item.title}

              <Link target="_blank" rel="noopener noreferrer" to={item.rawUrl}>
                <LinkIcon className="size-4" />
              </Link>
            </h1>

            <PlaylistItemKindBadge kind={item.kind} />
          </div>
        </div>
      </div>

      <Button variant="destructive" onClick={onClickDelete}>
        <Trash className="size-4" />
      </Button>
    </li>
  );
}
