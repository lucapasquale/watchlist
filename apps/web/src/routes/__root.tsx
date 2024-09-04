import { Helmet } from "react-helmet-async";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { Layout } from "../components/layout";

export const Route = createRootRoute({
  component: () => (
    <>
      <Helmet>
        <link rel="canonical" href="https://watchlist.luca.codes/" />
        <title>watchlist • Watch your favorite videos</title>
        <meta
          name="description"
          content="Create and share playlists of your favorite videos from YouTube, Twitch, Reddit and more"
        />
      </Helmet>

      <Layout>
        <Outlet />
      </Layout>
    </>
  ),
});
