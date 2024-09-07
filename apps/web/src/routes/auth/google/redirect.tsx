import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/auth/google/redirect-page";

const searchSchema = z.object({
  accessToken: z.string().min(1),
});

export const Route = createFileRoute("/auth/google/redirect")({
  validateSearch: searchSchema,
  component: Page,
});
