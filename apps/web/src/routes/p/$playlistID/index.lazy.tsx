import { createLazyFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/playlist/view/page";

export const Route = createLazyFileRoute("/p/$playlistID/")({
  component: Page,
});
