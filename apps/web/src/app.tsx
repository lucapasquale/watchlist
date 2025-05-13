import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";

import { AUTH_TOKEN_KEY } from "~common/constants.js";
import { ApolloProvider } from "~common/providers/apollo-provider/index.js";
import { CurrentUserProvider } from "~common/providers/current-user-provider.js";
import { ThemeProvider } from "~common/providers/theme-provider.js";

import { routeTree } from "./routeTree.gen.js";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => <main className="h-240" />,
  context: { hasToken: false },
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
              <RouterProvider
                router={router}
                context={{ hasToken: !!localStorage.getItem(AUTH_TOKEN_KEY) }}
              />
            </CurrentUserProvider>
          </ThemeProvider>
        </ApolloProvider>
      </HelmetProvider>
    </StrictMode>
  );
}
