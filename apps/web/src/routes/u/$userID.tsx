import { createFileRoute } from "@tanstack/react-router";

import { UserViewDocument } from "~common/graphql-types";
import { client } from "~common/providers/apollo-provider";
import { Page } from "~modules/user/page";

export const Route = createFileRoute("/u/$userID")({
  loader: async ({ params }) => {
    await client.query({
      query: UserViewDocument,
      variables: { userID: params.userID },
    });
  },
  component: Page,
});
