import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/playlist/video/page";

const searchSchema = z.object({
  shuffleSeed: z.string().min(1).optional(),
});

export const Route = createFileRoute("/p/$playlistID/$videoID")({
  validateSearch: searchSchema,
  component: Page,
});
