import React from "react";
import { useApolloClient } from "@apollo/client";

export function Page() {
  const client = useApolloClient();

  React.useEffect(() => {
    client.clearStore();
    localStorage.clear();

    window.location.pathname = "/";
  }, [client]);

  return null;
}
