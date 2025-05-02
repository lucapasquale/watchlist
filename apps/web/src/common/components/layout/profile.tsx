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
              <GoogleIcon className="size-4 mr-2" />
              Sign in with Google
            </Button>
          </Link>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 hover:underline">
        <h4>{user.name}</h4>

        <Avatar>
          <AvatarImage src={user.profilePictureUrl ?? undefined} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <Link to="/u/$userID" params={{ userID: user.id }}>
          <DropdownMenuItem>My playlists</DropdownMenuItem>
        </Link>

        <Link to="/auth/logout">
          <DropdownMenuItem variant="destructive">Logout</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GoogleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}
