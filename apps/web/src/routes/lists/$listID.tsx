import { createFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/List/page";

export const Route = createFileRoute("/lists/$listID")({
  component: Page,
});
