import { createLazyFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/home/page";

export const Route = createLazyFileRoute("/")({
  component: Page,
});
