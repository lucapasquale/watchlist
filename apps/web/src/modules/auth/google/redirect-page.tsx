import React from "react";

import { AUTH_TOKEN_KEY, LOGIN_REDIRECT_URL_KEY } from "~common/constants.js";
import { Route } from "~routes/auth/google/redirect.js";

export function Page() {
  const search = Route.useSearch();

  React.useEffect(() => {
    localStorage.setItem(AUTH_TOKEN_KEY, search.accessToken);
    window.location.search = "";

    const redirectHref = localStorage.getItem(LOGIN_REDIRECT_URL_KEY);
    if (redirectHref) {
      window.location.href = redirectHref;
      return;
    }

    window.location.pathname = "/";
  }, [search.accessToken]);

  return <main className="h-240" />;
}
