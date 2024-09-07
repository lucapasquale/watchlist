import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Button } from "@ui/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";

import { useCurrentUser } from "~common/providers/current-user-provider";
import { UserViewQuery } from "~graphql/types";

import { CreateNew } from "./create-new";
import { ImportFromYoutube } from "./import-from-youtube";

type Props = {
  user: UserViewQuery["user"];
};

export function UserInfo({ user }: Props) {
  const { user: currentUser } = useCurrentUser();

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

      {user.id === currentUser?.id && (
        <CardFooter className="grid grid-cols-2 items-center justify-between gap-4">
          <Dialog
            open={createState === "youtube"}
            onOpenChange={(o) => setCreateState(o ? "youtube" : null)}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
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
