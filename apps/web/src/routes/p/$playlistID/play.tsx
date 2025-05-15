import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { PlaylistPlayPageDocument } from "~common/graphql-types.js";
import { client } from "~common/providers/apollo-provider/index.js";

const searchSchema = z.object({
  shuffleSeed: z.string().min(1).optional(),
});

export const Route = createFileRoute("/p/$playlistID/play")({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { shuffleSeed } }) => ({ shuffleSeed }),
  loader: async ({ params, deps }) => {
    const { data } = await client.query({
      query: PlaylistPlayPageDocument,
      variables: { playlistID: params.playlistID, shuffleSeed: deps.shuffleSeed },
    });

    const videoID = deps.shuffleSeed
      ? data.playlist.shuffleFirstItem?.id
      : data.playlist.firstItem?.id;

    if (!videoID) {
      throw redirect({
        to: "/p/$playlistID",
        params: { playlistID: params.playlistID },
        replace: true,
      });
    }

    throw redirect({
      to: "/p/$playlistID/$videoID",
      params: { playlistID: params.playlistID, videoID },
      search: { shuffleSeed: deps.shuffleSeed },
      replace: true,
    });
  },
});
