import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/auth/logout/page.js";

const logoutSearch = z.object({
  signIn: z.literal("true").optional(),
  redirectUrl: z.string().min(1).optional(),
});

export const Route = createFileRoute("/auth/logout")({
  validateSearch: logoutSearch.parse,
  component: Page,
});
