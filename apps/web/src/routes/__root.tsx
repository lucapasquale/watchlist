import { Outlet, createRootRouteWithContext, useLocation } from "@tanstack/react-router";
import React from "react";

import { Layout } from "~common/components/layout/index.js";

type Context = {
  hasToken: boolean;
};

export const Route = createRootRouteWithContext<Context>()({
  component: () => {
    const { pathname } = useLocation();

    React.useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  },
});
