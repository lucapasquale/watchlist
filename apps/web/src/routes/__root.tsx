import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";

import { Layout } from "~common/components/layout/index.js";

type Context = {
  hasToken: boolean;
};

export const Route = createRootRouteWithContext<Context>()({
  component: () => (
    <>
      <Helmet>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎥</text></svg>"
        />
        <title>watchlist • Watch your favorite videos</title>
        <meta
          name="description"
          content="Create and share playlists of your favorite videos from YouTube, Reddit and more"
        />
        <link rel="canonical" href="https://watchlist.luca.codes/" />
      </Helmet>

      <Layout>
        <Outlet />
      </Layout>
    </>
  ),
});
