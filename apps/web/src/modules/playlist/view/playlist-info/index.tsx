import React from "react";
import { Pencil, Play, Shuffle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Button } from "@ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { cn } from "@ui/lib/utils";

import { PlaylistViewQuery } from "~common/graphql-types";

import { UpdatePlaylistForm } from "./update-playlist-form";

type Props = {
  playlist: PlaylistViewQuery["playlist"];
  isOwner: boolean;
  shuffleSeed: string;
};

export function PlaylistInfo({ playlist, isOwner, shuffleSeed }: Props) {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <Card className="rounded-xl flex flex-col gap-4 bg-card">
      <CardHeader className="gap-2">
        <CardTitle>
          {isEditing ? (
            <UpdatePlaylistForm playlist={playlist} onClose={() => setIsEditing(false)} />
          ) : (
            <span className="flex items-center justify-between gap-2">
              {playlist.name}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className={cn(!isOwner && "hidden")}
              >
                <Pencil className="size-4" />
              </Button>
            </span>
          )}
        </CardTitle>

        <Link to="/u/$userID" params={{ userID: playlist.user.id }}>
          <CardDescription className="flex items-center gap-2 hover:underline">
            <Avatar className="size-6">
              <AvatarImage src={playlist.user.profilePictureUrl ?? undefined} />
              <AvatarFallback>{playlist.user.initials}</AvatarFallback>
            </Avatar>

            {playlist.user.name}
          </CardDescription>
        </Link>
      </CardHeader>

      <CardContent>
        {playlist.itemsCount} video{playlist.itemsCount === 1 ? "" : "s"}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4">
        {playlist.shuffleFirstItem && (
          <Link
            to="/p/$playlistID/$videoID"
            params={{ playlistID: playlist.id, videoID: playlist.shuffleFirstItem.id.toString() }}
            search={{ shuffleSeed }}
            className="w-full"
          >
            <Button tabIndex={-1} variant="secondary" className="w-full">
              Shuffle <Shuffle className="size-4 ml-2" />
            </Button>
          </Link>
        )}

        {playlist.firstItem && (
          <Link
            to="/p/$playlistID/$videoID"
            params={{ playlistID: playlist.id, videoID: playlist.firstItem.id.toString() }}
            className="w-full"
          >
            <Button tabIndex={-1} className="w-full">
              Play <Play className="size-4 ml-2" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
