import { GripVertical, Trash } from "lucide-react";
import { useMutation } from "@apollo/client";
import { DraggableProvided } from "@hello-pangea/dnd";
import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";

import {
  DeletePlaylistItemDocument,
  PlaylistViewDocument,
  type PlaylistViewQuery,
} from "~graphql/types";
import { Route } from "~routes/p/$playlistID/index.lazy";

type Props = {
  item: PlaylistViewQuery["playlist"]["items"][number];
  isOwner: boolean;
  onDelete?: () => void;
  provided: DraggableProvided;
  isDragging?: boolean;
  style?: React.CSSProperties;
};

export function PlaylistItem({ item, isOwner, onDelete, provided, style, isDragging }: Props) {
  const { playlistID } = Route.useParams();

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
      ref={provided.innerRef}
      style={getStyle({ provided, style, isDragging })}
      className={cn(
        "flex items-center justify-between gap-1 rounded-xl bg-card list-none",
        isDragging && "bg-card",
      )}
    >
      <div className="flex items-center">
        {isOwner ? (
          <div
            {...provided.dragHandleProps}
            className="hidden md:flex flex-row items-center self-stretch px-4"
          >
            <GripVertical className="size-4" />
          </div>
        ) : (
          <div className="px-4 size-4" />
        )}

        <Link
          to="/p/$playlistID/$videoID"
          params={{ playlistID, videoID: item.id }}
          className="flex items-start md:items-center gap-2 flex-1 basis-0"
        >
          <img
            src={item.thumbnailUrl}
            className="aspect-video min-w-[160px] min-h-[90px] basis-0 rounded-md"
          />

          <h4 title={item.title} className="text-sm md:text-xl line-clamp-2 hover:underline">
            {item.title}
          </h4>
        </Link>
      </div>

      {isOwner && (
        <Button variant="destructive" onClick={onClickDelete} className="mr-4">
          <Trash className="size-4" />
        </Button>
      )}
    </li>
  );
}
