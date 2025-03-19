import { createFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/auth/logout/page.js";

export const Route = createFileRoute("/auth/logout")({
  component: Page,
});
