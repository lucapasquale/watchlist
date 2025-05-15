import { Link } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import { LinkIcon, Pencil, Play, Shuffle } from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar.js";
import { Button } from "@ui/components/ui/button.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";

import { PlaylistViewQuery } from "~common/graphql-types.js";

import { EditPlaylistForm } from "./edit-playlist-form.js";

type Props = {
  playlist: PlaylistViewQuery["playlist"];
  shuffleSeed: string;
  isOwner: boolean;
};

export function PlaylistInfo({ playlist, shuffleSeed, isOwner }: Props) {
  const [isEditing, setIsEditing] = React.useState(false);

  if (isEditing) {
    return (
      <Card>
        <CardContent className="space-y-2">
          <EditPlaylistForm playlist={playlist} onClose={() => setIsEditing(false)} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle>
          <span
            className={cn(
              "grid h-9 grid-cols-1 items-center justify-between gap-2",
              isOwner && "grid-cols-[1fr_36px]",
            )}
          >
            <div title={playlist.name} className="line-clamp-1">
              {playlist.name}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className={cn(!isOwner && "hidden")}
            >
              <Pencil className="size-4" />
            </Button>
          </span>
        </CardTitle>

        <Link to="/u/$userID" params={{ userID: playlist.user.id }}>
          <CardDescription className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={playlist.user.profilePictureUrl ?? undefined} />
              <AvatarFallback>{playlist.user.initials}</AvatarFallback>
            </Avatar>
            by {playlist.user.name}
          </CardDescription>
        </Link>
      </CardHeader>

      <CardContent className="text-muted-foreground flex items-center gap-1 text-xs">
        <span>
          {playlist.itemsCount} video{playlist.itemsCount === 1 ? "" : "s"}
        </span>{" "}
        •{" "}
        <span title={new Date(playlist.createdAt).toLocaleString("en-US")}>
          Created on {new Date(playlist.createdAt).toLocaleDateString("en-US")}
        </span>
        {playlist.href && (
          <>
            {" • "}
            <Link
              target="_blank"
              rel="noreferrer noopener"
              to={playlist.href}
              className="flex items-center gap-1 hover:underline"
            >
              Source <LinkIcon className="size-3" />
            </Link>
          </>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4">
        {playlist.shuffleFirstItem && (
          <Link
            to="/p/$playlistID/$videoID"
            params={{
              playlistID: playlist.id,
              videoID: playlist.shuffleFirstItem.id,
            }}
            search={{ shuffleSeed }}
            className="w-full"
          >
            <Button tabIndex={-1} variant="secondary" className="w-full">
              Shuffle <Shuffle className="size-4" />
            </Button>
          </Link>
        )}

        {playlist.firstItem && (
          <Link
            to="/p/$playlistID/$videoID"
            params={{ playlistID: playlist.id, videoID: playlist.firstItem.id }}
            className="w-full"
          >
            <Button tabIndex={-1} className="w-full">
              Play <Play className="size-4" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

PlaylistInfo.Skeleton = () => <Skeleton className="h-[256px]" />;
