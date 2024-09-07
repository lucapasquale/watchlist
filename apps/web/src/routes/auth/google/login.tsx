import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/auth/google/login-page";

const searchSchema = z.object({
  redirectUrl: z.string().url().optional(),
});

export const Route = createFileRoute("/auth/google/login")({
  validateSearch: searchSchema,
  component: Page,
});
