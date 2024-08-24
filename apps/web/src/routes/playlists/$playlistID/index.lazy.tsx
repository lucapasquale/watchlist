import { createLazyFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/Playlist/view";

export const Route = createLazyFileRoute("/playlists/$playlistID/")({
  component: Page,
});
