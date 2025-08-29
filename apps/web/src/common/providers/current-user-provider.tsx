import { ErrorLike, NetworkStatus } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import React from "react";

import { AUTH_TOKEN_KEY } from "~common/constants";
import { UserProviderDocument, UserProviderQuery } from "~common/graphql-types.js";

type UserProviderState = {
  loading: boolean;
  error: ErrorLike | undefined;
  user: UserProviderQuery["me"] | null;
};

const UserProviderContext = React.createContext<UserProviderState>({
  loading: true,
  error: undefined,
  user: null,
});

type UserProviderProps = {
  children: React.ReactNode;
};

export function CurrentUserProvider({ children }: UserProviderProps) {
  const { error, data, networkStatus } = useQuery(UserProviderDocument, {
    skip: !localStorage.getItem(AUTH_TOKEN_KEY),
  });

  const value = {
    loading: networkStatus === NetworkStatus.loading,
    error,
    user: data?.me ?? null,
  };

  return <UserProviderContext.Provider value={value}>{children}</UserProviderContext.Provider>;
}

export function useCurrentUser() {
  const context = React.useContext(UserProviderContext);

  if (context === undefined) throw new Error("useCurrentUser must be used within a UserProvider");

  return context;
}
