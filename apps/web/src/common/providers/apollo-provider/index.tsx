import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as RootApolloProvider,
  from,
} from "@apollo/client";

import { errorLink } from "./error-link.js";
import { httpLink } from "./http-link.js";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]),
});

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <RootApolloProvider client={client}>{children}</RootApolloProvider>;
}
