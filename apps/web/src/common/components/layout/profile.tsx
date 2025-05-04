import React from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar.js";
import { Button, buttonVariants } from "@ui/components/ui/button.js";
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
import { cn } from "@ui/lib/utils";

export function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const usp = new URLSearchParams(location.search);

  const { loading, user } = useCurrentUser();

  const [redirectUrl, setRedirectUrl] = React.useState(window.location.href);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    url.pathname = location.pathname;
    url.search = location.searchStr;
    url.searchParams.delete("signup");

    setRedirectUrl(url.toString());
  }, [location]);

  const onOpenChange = (open: boolean) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, signup: open ? "true" : undefined }) });
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Dialog open={!!usp.get("signup")} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Link to="." search={(prev) => ({ ...prev, signup: "true" })}>
            <Button>Login</Button>
          </Link>
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
      <DropdownMenuTrigger
        className={cn("flex items-center gap-2", buttonVariants({ variant: "ghost", size: "lg" }))}
      >
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
