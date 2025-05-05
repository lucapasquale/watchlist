import {
  ApolloClient,
  ApolloProvider as RootApolloProvider,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { API_URL, AUTH_TOKEN_KEY } from "~common/constants.js";

const errorLink = onError(({ graphQLErrors }) => {
  graphQLErrors?.forEach(({ extensions }) => {
    if (extensions?.code === "UNAUTHENTICATED") {
      const usp = new URLSearchParams(window.location.search);
      usp.set("signIn", "true");
      usp.set("redirectUrl", window.location.href);

      const url = new URL(window.location.href);
      url.pathname = "/auth/logout";
      url.search = usp.toString();

      window.location.href = url.toString();
    }
  });
});

const httpLink = new HttpLink({
  uri: API_URL + "/graphql",
  headers: {
    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
  },
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]),
});

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <RootApolloProvider client={client}>{children}</RootApolloProvider>;
}
