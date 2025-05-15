import { useNavigate } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";

import { useCurrentUser } from "~common/providers/current-user-provider.js";

import { CreatePlaylist } from "../view/create-playlist";
import { UserInfo } from "../view/user-info";
import { UserPlaylists } from "../view/user-playlists";

export function Page() {
  const navigate = useNavigate();
  const { user, error } = useCurrentUser();

  if (error) {
    navigate({
      to: "/",
      reloadDocument: true,
      search: { signIn: "true", redirect: window.location.href },
    });
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>watchlist • {user.name}</title>
      </Helmet>

      <main className="container mx-auto my-4 grid grid-cols-1 items-start gap-6 px-2 sm:px-0 lg:grid-cols-[minmax(min(350px,100%),_1fr)_3fr]">
        <aside className="mt-2 flex flex-col gap-4">
          <UserInfo user={user} />

          <CreatePlaylist />
        </aside>

        <UserPlaylists userID={user.id} isOwner />
      </main>
    </>
  );
}
