import { createLazyFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/Playlist/edit";

export const Route = createLazyFileRoute("/playlists/$playlistID/edit")({
  component: Page,
});
