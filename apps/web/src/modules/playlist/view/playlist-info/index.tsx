import React from "react";
import { Pencil } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { cn } from "@ui/lib/utils";

import { PlaylistViewQuery } from "~common/graphql-types";

import { FirstItemButtons } from "./first-item-buttons";
import { UpdatePlaylistForm } from "./update-playlist-form";

type Props = {
  playlist: PlaylistViewQuery["playlist"];
  isOwner: boolean;
};

export function PlaylistInfo({ playlist, isOwner }: Props) {
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

      <FirstItemButtons playlist={playlist} />
    </Card>
  );
}
