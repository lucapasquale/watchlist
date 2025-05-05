import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { ApolloProvider } from "~common/providers/apollo-provider.js";
import { CurrentUserProvider } from "~common/providers/current-user-provider.js";
import { ThemeProvider } from "~common/providers/theme-provider.js";

import { routeTree } from "./routeTree.gen.js";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => <main className="h-240" />,
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
