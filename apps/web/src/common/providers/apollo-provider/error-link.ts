import { CombinedGraphQLErrors } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

import { API_URL, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "~common/constants";

export const errorLink = new ErrorLink(({ operation, forward, error }) => {
  if (!CombinedGraphQLErrors.is(error)) {
    return;
  }

  for (const { extensions } of error.errors) {
    if (extensions?.code !== "UNAUTHENTICATED") {
      return;
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return;
    }

    refreshTokens(refreshToken).then((data) => {
      const oldHeaders = operation.getContext().headers;
      operation.setContext({
        headers: {
          ...oldHeaders,
          authorization: `Bearer ${data.accessToken}`,
        },
      });

      localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

      return forward(operation);
    });
  }
});

async function refreshTokens(refreshToken: string) {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (response.status !== 200) {
    throw new Error("Failed to refresh tokens");
  }

  return response.json() as Promise<{ accessToken: string; refreshToken: string }>;
}
