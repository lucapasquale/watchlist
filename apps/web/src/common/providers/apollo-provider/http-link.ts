import { HttpLink } from "@apollo/client";

import { API_URL, AUTH_TOKEN_KEY } from "~common/constants";

export const httpLink = new HttpLink({
  uri: API_URL + "/graphql",
  headers: {
    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
  },
  clientAwareness: { name: "watchlist-web" },
});
