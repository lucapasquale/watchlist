import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { PlaylistItemViewDocument } from "~common/graphql-types.js";
import { client } from "~common/providers/apollo-provider/index.js";
import { Page } from "~modules/playlist/video/page.js";

const searchSchema = z.object({
  shuffleSeed: z.string().min(1).optional(),
});

export const Route = createFileRoute("/p/$playlistID/$videoID")({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { shuffleSeed } }) => ({ shuffleSeed }),
  loader: async ({ params, deps }) => {
    try {
      await client.query({
        query: PlaylistItemViewDocument,
        variables: {
          playlistItemID: params.videoID,
          shuffleSeed: deps.shuffleSeed,
        },
      });
    } catch {
      throw redirect({
        to: "/p/$playlistID/play",
        params: { playlistID: params.playlistID },
        replace: true,
      });
    }
  },
  component: Page,
});
