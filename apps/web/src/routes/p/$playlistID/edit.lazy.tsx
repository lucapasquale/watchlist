import { createLazyFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/playlist/edit/page";

export const Route = createLazyFileRoute("/p/$playlistID/edit")({
  component: Page,
});
