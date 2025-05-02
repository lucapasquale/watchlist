import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar.js";
import { Button } from "@ui/components/ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu.js";

import { useCurrentUser } from "~common/providers/current-user-provider.js";
import { Google } from "../icons";

export function Profile() {
  const location = useLocation();
  const { loading, user } = useCurrentUser();

  const [redirectUrl, setRedirectUrl] = React.useState(window.location.href);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    url.pathname = location.pathname;
    url.search = location.searchStr;

    setRedirectUrl(url.toString());
  }, [location]);

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Login</Button>
        </DialogTrigger>

        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
          </DialogHeader>

          <Link to="/auth/google/login" search={{ redirectUrl }} className="py-12">
            <Button variant="outline" className="w-full">
              <Google className="size-4 mr-2" />
              Sign in with Google
            </Button>
          </Link>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <h4>{user.name}</h4>

        <Avatar>
          <AvatarImage src={user.profilePictureUrl ?? undefined} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <Link to="/u/$userID" className="hover:no-underline" params={{ userID: user.id }}>
          <DropdownMenuItem>My playlists</DropdownMenuItem>
        </Link>

        <Link to="/auth/logout" className="hover:no-underline">
          <DropdownMenuItem variant="destructive">Logout</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
