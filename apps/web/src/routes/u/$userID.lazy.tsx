import { createLazyFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/user/page";

export const Route = createLazyFileRoute("/u/$userID")({
  component: Page,
});
