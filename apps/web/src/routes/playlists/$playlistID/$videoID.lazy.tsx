import { createLazyFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/Video/page";

export const Route = createLazyFileRoute("/playlists/$playlistID/$videoID")({
  component: Page,
});
