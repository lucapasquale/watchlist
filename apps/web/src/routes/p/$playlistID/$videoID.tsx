import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { PlaylistItemViewDocument } from "~common/graphql-types";
import { client } from "~common/providers/apollo-provider";
import { Page } from "~modules/playlist/video/page";

const searchSchema = z.object({
  shuffleSeed: z.string().min(1).optional(),
});

export const Route = createFileRoute("/p/$playlistID/$videoID")({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { shuffleSeed } }) => ({ shuffleSeed }),
  loader: async ({ params, deps }) => {
    await client.query({
      query: PlaylistItemViewDocument,
      variables: {
        playlistItemID: params.videoID,
        shuffleSeed: deps.shuffleSeed,
      },
    });
  },
  component: Page,
});
