import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { Page } from "~modules/Video/page";

const searchSchema = z.object({
  shuffle: z.boolean().optional(),
});

export const Route = createFileRoute("/playlists/$playlistID/$videoID")({
  validateSearch: searchSchema,
  component: Page,
});
