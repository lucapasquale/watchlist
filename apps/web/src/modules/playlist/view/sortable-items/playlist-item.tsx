import React from "react";
import { GripVertical, Trash } from "lucide-react";
import { useMutation } from "@apollo/client";
import { DraggableProvided } from "@hello-pangea/dnd";
import { Link } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/components/ui/alert-dialog.js";
import { Button } from "@ui/components/ui/button.js";
import { Card, CardDescription, CardTitle } from "@ui/components/ui/card.js";
import { cn } from "@workspace/ui/lib/utils";

import {
  DeletePlaylistItemDocument,
  PlaylistItemQueueSidebarDocument,
  PlaylistViewDocument,
  type PlaylistViewQuery,
} from "~common/graphql-types.js";
import { PLAYLIST_ITEM_KIND } from "~common/translations.js";
import { Route } from "~routes/p/$playlistID/index.js";

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

  const [open, setOpen] = React.useState(false);

  const [deletePlaylistItem] = useMutation(DeletePlaylistItemDocument, {
    refetchQueries: [PlaylistViewDocument, PlaylistItemQueueSidebarDocument],
    awaitRefetchQueries: true,
  });

  const onClickDelete = async () => {
    await deletePlaylistItem({ variables: { id: item.id } });

    setOpen(false);
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
    <Card
      {...provided.draggableProps}
      ref={provided.innerRef}
      style={getStyle({ provided, style, isDragging })}
      className={cn(
        "flex flex-row items-center justify-between gap-1 rounded-xl bg-card list-none",
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

        <div className="p-0">
          <Link
            to="/p/$playlistID/$videoID"
            params={{ playlistID, videoID: item.id }}
            className="group flex items-start md:items-center gap-4 flex-1 basis-0 hover:no-underline"
          >
            <img
              src={item.thumbnailUrl}
              className="aspect-video min-w-[160px] min-h-[90px] basis-0 rounded-md"
            />

            <div className="flex flex-col gap-0.5">
              <CardTitle
                title={item.title}
                className="text-sm md:text-xl line-clamp-2 group-hover:underline"
              >
                {item.title}
              </CardTitle>

              <CardDescription>{PLAYLIST_ITEM_KIND[item.kind]}</CardDescription>
            </div>
          </Link>
        </div>
      </div>

      {isOwner && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="mr-4 text-primary-foreground hover:!bg-destructive/20"
            >
              <Trash className="size-4" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClickDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
}
