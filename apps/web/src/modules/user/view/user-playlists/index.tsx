import React from "react";
import { Trash } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
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
import { Skeleton } from "@ui/components/ui/skeleton.js";

import {
  DeletePlaylistDocument,
  UserPlaylistsDocument,
  UserViewDocument,
} from "~common/graphql-types.js";

type Props = {
  userID: string;
  isOwner: boolean;
};

export function UserPlaylists({ userID, isOwner }: Props) {
  const [open, setOpen] = React.useState(false);

  const { loading, data } = useQuery(UserPlaylistsDocument, {
    variables: { userID },
  });

  const [deletePlaylist] = useMutation(DeletePlaylistDocument, {
    refetchQueries: [UserViewDocument],
    awaitRefetchQueries: true,
  });

  const onClickDelete = async (playlistId: string) => {
    await deletePlaylist({ variables: { id: playlistId } });

    setOpen(false);
  };

  if (loading || !data) {
    return <UserPlaylists.Skeleton />;
  }

  return (
    <ol className="space-y-4">
      {data.user.playlists.map((playlist) => (
        <Card key={playlist.id} className="flex flex-row items-center justify-between">
          <div className="ml-4">
            <Link to="/p/$playlistID" params={{ playlistID: playlist.id }}>
              <CardTitle>{playlist.name}</CardTitle>
            </Link>

            <CardDescription>
              {playlist.itemsCount} video{playlist.itemsCount === 1 ? "" : "s"}
            </CardDescription>
          </div>

          {isOwner && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="mr-4 hover:!bg-destructive/20">
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
                  <AlertDialogAction onClick={() => onClickDelete(playlist.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </Card>
      ))}
    </ol>
  );
}

UserPlaylists.Skeleton = () => (
  <section className="w-full h-[975px] overflow-y-scroll flex flex-col gap-2">
    <Skeleton className="h-[98px] bg-card flex-none rounded-xl" />
    <Skeleton className="h-[98px] bg-card flex-none rounded-xl" />
    <Skeleton className="h-[98px] bg-card flex-none rounded-xl" />
  </section>
);
