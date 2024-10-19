import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";

import { useCurrentUser } from "~common/providers/current-user-provider";

import { LoginModal } from "../login-modal";

export function Profile() {
  const { loading, user } = useCurrentUser();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <LoginModal>
        <Button>Login</Button>
      </LoginModal>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
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
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
