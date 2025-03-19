import React from "react";
import { useQuery } from "@apollo/client";

import { UserProviderDocument, UserProviderQuery } from "~common/graphql-types.js";

type UserProviderState = {
  loading: boolean;
  user: UserProviderQuery["me"] | null;
};

const UserProviderContext = React.createContext<UserProviderState>({
  loading: true,
  user: null,
});

type UserProviderProps = {
  children: React.ReactNode;
};

export function CurrentUserProvider({ children }: UserProviderProps) {
  const { loading, data } = useQuery(UserProviderDocument);

  const value = {
    loading,
    user: data?.me ?? null,
  };

  return <UserProviderContext.Provider value={value}>{children}</UserProviderContext.Provider>;
}

export function useCurrentUser() {
  const context = React.useContext(UserProviderContext);

  if (context === undefined) throw new Error("useCurrentUser must be used within a UserProvider");

  return context;
}
