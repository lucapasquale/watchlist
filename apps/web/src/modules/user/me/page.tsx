import { useNavigate } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";

import { useCurrentUser } from "~common/providers/current-user-provider.js";

import { CreateCustomPlaylist } from "../view/create-playlist/create-custom-playlist";
import { ImportPlaylist } from "../view/create-playlist/import-playlist";
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
        <aside className="flex flex-col gap-4">
          <UserInfo user={user} />

          <div className="flex items-center gap-4">
            <ImportPlaylist />

            <CreateCustomPlaylist />
          </div>
        </aside>

        <UserPlaylists userID={user.id} isOwner />
      </main>
    </>
  );
}
