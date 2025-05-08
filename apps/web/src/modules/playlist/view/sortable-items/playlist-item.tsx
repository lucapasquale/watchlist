import { useMutation } from "@apollo/client";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { Edge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Link } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import { GripVertical, Trash } from "lucide-react";
import React from "react";

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

import {
  DeletePlaylistItemDocument,
  PlaylistViewDocument,
  type PlaylistViewQuery,
} from "~common/graphql-types.js";
import { PLAYLIST_ITEM_KIND } from "~common/translations.js";
import { Route } from "~routes/p/$playlistID/index.js";

type TaskState =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement }
  | { type: "is-dragging" }
  | { type: "is-dragging-over"; closestEdge: Edge | null };

type Props = {
  index: number;
  item: PlaylistViewQuery["playlist"]["items"][number];
  isOwner: boolean;
  onDelete?: () => void;
  style?: React.CSSProperties;
};

export function PlaylistItem({ index, item, isOwner, onDelete, style }: Props) {
  const { playlistID } = Route.useParams();

  const itemRef = React.useRef(null);
  const handleRef = React.useRef(null);

  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<TaskState>({ type: "idle" });

  const [deletePlaylistItem] = useMutation(DeletePlaylistItemDocument, {
    refetchQueries: [PlaylistViewDocument],
    awaitRefetchQueries: true,
  });

  const onClickDelete = async () => {
    await deletePlaylistItem({ variables: { id: item.id } });

    setOpen(false);
    onDelete?.();
  };

  React.useEffect(() => {
    const element = itemRef.current;
    const dragHandle = handleRef.current;
    if (!element || !dragHandle) {
      return;
    }

    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData: () => ({ id: item.id, index }),
        onDragStart: () => setState({ type: "is-dragging" }),
        onDrop: () => setState({ type: "idle" }),
      }),
      dropTargetForElements({
        element,
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          return attachClosestEdge(
            { id: item.id },
            { input, element, allowedEdges: ["top", "bottom"] },
          );
        },
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState({ type: "is-dragging-over", closestEdge });
        },
        onDragLeave() {
          setState({ type: "idle" });
        },
        onDrop() {
          setState({ type: "idle" });
        },
      }),
      autoScrollForElements({
        element,
        getAllowedAxis: () => "vertical",
        getConfiguration: () => ({ maxScrollSpeed: "fast" }),
      }),
    );
  }, [item.id]);

  return (
    <Card
      ref={itemRef}
      style={style}
      className={cn(
        "relative py-1 flex flex-row items-center justify-between gap-1 rounded-xl bg-card list-none",
        state.type === "is-dragging" && "opacity-40",
      )}
    >
      <div className="flex items-center">
        {isOwner ? (
          <div className="block px-1">
            <div className="cursor-grab flex flex-row items-center p-2 rounded hover:bg-accent">
              <GripVertical ref={handleRef} className="size-4" />
            </div>
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

      {state.type === "is-dragging-over" && state.closestEdge ? (
        <DropIndicator type="terminal-no-bleed" gap="10px" edge={state.closestEdge} />
      ) : null}
    </Card>
  );
}
