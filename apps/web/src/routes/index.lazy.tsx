import { createLazyFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/home/page.js";

export const Route = createLazyFileRoute("/")({
  component: Page,
});
