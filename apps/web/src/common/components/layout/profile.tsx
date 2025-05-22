import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import React from "react";

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
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, user } = useCurrentUser();

  const redirectUrl = React.useMemo(() => {
    if (location.search.redirectUrl) {
      return location.search.redirectUrl;
    }

    const url = new URL(window.location.href);
    url.pathname = location.pathname;
    url.search = location.searchStr;
    url.searchParams.delete("signIn");
    url.searchParams.delete("redirectUrl");
    return url.toString();
  }, [location]);

  const onOpenChange = (open: boolean) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, signIn: open ? "true" : undefined }) });
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Dialog open={location.search.signIn === "true"} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Link to="." search={(prev) => ({ ...prev, signIn: "true" })}>
            <Button>Login</Button>
          </Link>
        </DialogTrigger>

        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
          </DialogHeader>

          <Link to="/auth/google/login" search={{ redirectUrl }} className="py-12">
            <Button variant="outline" className="w-full">
              <Google className="mr-2 size-4" />
              Sign in with Google
            </Button>
          </Link>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default">
          <h4>{user.name}</h4>

          <Avatar>
            <AvatarImage src={user.profilePictureUrl ?? undefined} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <Link to="/me" className="hover:no-underline">
          <DropdownMenuItem>My playlists</DropdownMenuItem>
        </Link>

        <Link to="/auth/logout" className="hover:no-underline">
          <DropdownMenuItem variant="destructive">Logout</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
