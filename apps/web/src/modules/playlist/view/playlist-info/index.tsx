import { Link } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import { Pencil } from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar.js";
import { Button } from "@ui/components/ui/button.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";

import { PlaylistViewQuery } from "~common/graphql-types.js";

import { EditPlaylistForm } from "./edit-playlist-form.js";
import { FirstItemButtons } from "./first-item-buttons.js";

type Props = {
  playlist: PlaylistViewQuery["playlist"];
  isOwner: boolean;
};

export function PlaylistInfo({ playlist, isOwner }: Props) {
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
        </CardTitle>

        <Link to="/u/$userID" params={{ userID: playlist.user.id }}>
          <CardDescription className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={playlist.user.profilePictureUrl ?? undefined} />
              <AvatarFallback>{playlist.user.initials}</AvatarFallback>
            </Avatar>

            {playlist.user.name}
          </CardDescription>
        </Link>
      </CardHeader>

      <CardContent className="space-y-2">
        <div>
          {playlist.itemsCount} video{playlist.itemsCount === 1 ? "" : "s"}
        </div>

        <span className="text-muted-foreground text-xs">
          Created on {new Date(playlist.createdAt).toLocaleDateString("en-US")}
        </span>
      </CardContent>

      <FirstItemButtons playlist={playlist} />
    </Card>
  );
}

PlaylistInfo.Skeleton = () => <Skeleton className="h-[256px]" />;
