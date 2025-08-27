import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider as RootApolloProvider } from "@apollo/client/react";

import { errorLink } from "./error-link.js";
import { httpLink } from "./http-link.js";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([errorLink, httpLink]),
});

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <RootApolloProvider client={client}>{children}</RootApolloProvider>;
}
