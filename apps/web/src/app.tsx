import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { AUTH_TOKEN_KEY } from "~common/constants";
import { CurrentUserProvider } from "~common/providers/current-user-provider";
import { ThemeProvider } from "~common/providers/theme-provider";

import { routeTree } from "./routeTree.gen";

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL + "/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
  },
});

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <StrictMode>
      <HelmetProvider>
        <ApolloProvider client={client}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <CurrentUserProvider>
              <RouterProvider router={router} />
            </CurrentUserProvider>
          </ThemeProvider>
        </ApolloProvider>
      </HelmetProvider>
    </StrictMode>
  );
}
