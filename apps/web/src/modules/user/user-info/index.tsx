import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar.js";
import { Button } from "@ui/components/ui/button.js";
import { Card, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";

import { UserViewQuery } from "~common/graphql-types.js";

import { CreateNew } from "./create-new.js";
import { ImportFromYoutube } from "./import-from-youtube.js";

type Props = {
  user: UserViewQuery["user"];
  isOwner: boolean;
};

export function UserInfo({ user, isOwner }: Props) {
  const [createState, setCreateState] = React.useState<null | "new" | "youtube">(null);

  return (
    <Card className="rounded-xl flex flex-col gap-4 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={user.profilePictureUrl ?? undefined} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>

          {user.name}
        </CardTitle>
      </CardHeader>

      {isOwner && (
        <CardFooter className="grid grid-cols-2 items-center justify-between gap-2">
          <Dialog
            open={createState === "youtube"}
            onOpenChange={(o) => setCreateState(o ? "youtube" : null)}
          >
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full">
                Import from Youtube
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create from YouTube playlist</DialogTitle>
              </DialogHeader>

              <ImportFromYoutube />
            </DialogContent>
          </Dialog>

          <Dialog
            open={createState === "new"}
            onOpenChange={(o) => setCreateState(o ? "new" : null)}
          >
            <DialogTrigger asChild>
              <Button className="w-full">Create</Button>
            </DialogTrigger>

            <DialogContent className="max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create playlist</DialogTitle>
              </DialogHeader>

              <CreateNew />
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
}

UserInfo.Skeleton = () => (
  <section className="flex flex-col gap-4">
    <Skeleton className="h-[154px]" />
  </section>
);
