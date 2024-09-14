import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { ApolloProvider } from "~common/providers/apollo-provider";
import { CurrentUserProvider } from "~common/providers/current-user-provider";
import { ThemeProvider } from "~common/providers/theme-provider";

import { routeTree } from "./routeTree.gen";

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
        <ApolloProvider>
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
