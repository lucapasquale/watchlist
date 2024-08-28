import { createLazyFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/Playlist/view";

export const Route = createLazyFileRoute("/p/$playlistID/")({
  component: Page,
});
