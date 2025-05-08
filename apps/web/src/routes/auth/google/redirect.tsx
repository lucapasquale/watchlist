import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Page } from "~modules/auth/google/redirect-page.js";

const searchSchema = z.object({
  accessToken: z.string().min(1),
});

export const Route = createFileRoute("/auth/google/redirect")({
  validateSearch: searchSchema,
  component: Page,
});
