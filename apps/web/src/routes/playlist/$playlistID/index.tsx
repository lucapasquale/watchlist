import { createFileRoute, redirect } from "@tanstack/react-router";

import { PlaylistViewDocument } from "~common/graphql-types.js";
import { client } from "~common/providers/apollo-provider/index.js";
import { Page } from "~modules/playlist/view/page.js";

export const Route = createFileRoute("/playlist/$playlistID/")({
  loader: async ({ params }) => {
    try {
      await client.query({
        query: PlaylistViewDocument,
        variables: { playlistID: params.playlistID },
      });
    } catch {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
  },
  component: Page,
});
