import { ApolloClient, ApolloProvider as RootApolloProvider, InMemoryCache } from "@apollo/client";

import { API_URL, AUTH_TOKEN_KEY } from "~common/constants.js";

export const client = new ApolloClient({
  uri: API_URL + "/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
  },
});

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <RootApolloProvider client={client}>{children}</RootApolloProvider>;
}
