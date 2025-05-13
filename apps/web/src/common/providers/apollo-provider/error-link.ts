import { Observable } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { API_URL, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "~common/constants";

export const errorLink = onError(({ operation, forward, graphQLErrors }) => {
  if (!graphQLErrors) {
    return;
  }

  for (const { extensions } of graphQLErrors) {
    if (extensions?.code === "UNAUTHENTICATED") {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        return;
      }

      return new Observable((observer) => {
        refreshTokens(refreshToken)
          .then((data) => {
            operation.setContext(({ headers = {} }) => ({
              headers: { ...headers, authorization: `Bearer ${data.accessToken}` },
            }));

            localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
          })
          .then(() => {
            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            };

            // Retry last failed request
            forward(operation).subscribe(subscriber);
          })
          .catch((error) => {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);

            observer.error(error);
          });
      });
    }
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
