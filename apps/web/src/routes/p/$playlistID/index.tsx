import { createFileRoute } from "@tanstack/react-router";

import { PlaylistViewDocument } from "~common/graphql-types.js";
import { client } from "~common/providers/apollo-provider/index.js";
import { Page } from "~modules/playlist/view/page.js";

export const Route = createFileRoute("/p/$playlistID/")({
  loader: async ({ params }) => {
    await client.query({
      query: PlaylistViewDocument,
      variables: { playlistID: params.playlistID },
    });
  },
  component: Page,
});
