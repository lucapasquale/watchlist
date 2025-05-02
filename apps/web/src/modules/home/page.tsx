import { useQuery } from "@apollo/client";

import { HomePlaylistsDocument } from "~common/graphql-types.js";
import { LandingPage } from "./v0";

export function Page() {
  const { data } = useQuery(HomePlaylistsDocument);

  if (!data) {
    return <main>Loading...</main>;
  }

  return <LandingPage />;
}
