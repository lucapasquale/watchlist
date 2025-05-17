import { ApolloQueryResult } from "@apollo/client";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { PlaylistPlayPageDocument, PlaylistPlayPageQuery } from "~common/graphql-types.js";
import { client } from "~common/providers/apollo-provider/index.js";

const searchSchema = z.object({
  shuffleSeed: z.string().min(1).optional(),
});

export const Route = createFileRoute("/p/$playlistID/play")({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { shuffleSeed } }) => ({ shuffleSeed }),
  loader: async ({ params, deps }) => {
    let response: ApolloQueryResult<PlaylistPlayPageQuery>;
    try {
      response = await client.query({
        query: PlaylistPlayPageDocument,
        variables: { playlistID: params.playlistID, shuffleSeed: deps.shuffleSeed },
      });
    } catch {
      throw redirect({
        to: "/",
        replace: true,
      });
    }

    const videoID = deps.shuffleSeed
      ? response.data.playlist.shuffleFirstItem?.id
      : response.data.playlist.firstItem?.id;

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
