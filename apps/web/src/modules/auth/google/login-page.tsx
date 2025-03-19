import React from "react";

import { API_URL, LOGIN_REDIRECT_URL_KEY } from "~common/constants.js";
import { Route } from "~routes/auth/google/login.js";

export function Page() {
  const { redirectUrl } = Route.useSearch();

  React.useEffect(() => {
    if (redirectUrl) {
      localStorage.setItem(LOGIN_REDIRECT_URL_KEY, redirectUrl);
    }

    const apiURL = new URL(API_URL);
    apiURL.pathname = "/auth/google";

    window.location.href = apiURL.toString();
  }, [redirectUrl]);

  return null;
}
