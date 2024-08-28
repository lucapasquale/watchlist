import { createLazyFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/Playlist/edit";

export const Route = createLazyFileRoute("/p/$playlistID/edit")({
  component: Page,
});
