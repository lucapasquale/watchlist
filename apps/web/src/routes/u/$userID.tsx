import { createFileRoute } from "@tanstack/react-router";

import { UserViewDocument } from "~common/graphql-types.js";
import { client } from "~common/providers/apollo-provider/index.js";
import { Page } from "~modules/user/view/page.js";

export const Route = createFileRoute("/u/$userID")({
  loader: async ({ params }) => {
    await client.query({
      query: UserViewDocument,
      variables: { userID: params.userID },
    });
  },
  component: Page,
});
