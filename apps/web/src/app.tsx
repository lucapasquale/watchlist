import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { ThemeProvider } from "~components/theme-provider";

import { routeTree } from "./routeTree.gen";

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL + "/graphql",
  cache: new InMemoryCache(),
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
            <RouterProvider router={router} />
          </ThemeProvider>
        </ApolloProvider>
      </HelmetProvider>
    </StrictMode>
  );
}
