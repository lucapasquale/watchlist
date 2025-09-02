import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Page } from "~modules/auth/google/login-page.js";

const searchSchema = z.object({
  redirectUrl: z.url().optional(),
});

export const Route = createFileRoute("/auth/google/login")({
  validateSearch: searchSchema,
  component: Page,
});
