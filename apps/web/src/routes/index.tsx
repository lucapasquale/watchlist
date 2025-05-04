import { createFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/home/page.js";

export const Route = createFileRoute("/")({
  component: Page,
});
