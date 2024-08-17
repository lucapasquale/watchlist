import { createLazyFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/Playlist/page";

export const Route = createLazyFileRoute("/playlists/$playlistID/")({
  component: Page,
});
