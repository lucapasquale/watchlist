import { CombinedGraphQLErrors, Observable } from "@apollo/client";
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

    return new Observable((observer) => {
      refreshTokens(refreshToken).then((data) => {
        operation.setContext({
          headers: {
            ...operation.getContext().headers,
            authorization: `Bearer ${data.accessToken}`,
          },
        });

        localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

        return forward(operation).subscribe(observer);
      });
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

  const data: { accessToken: string; refreshToken: string } = await response.json();
  return data;
}
