import React from "react";
import { useApolloClient } from "@apollo/client";

export function Page() {
  const client = useApolloClient();

  React.useEffect(() => {
    client.clearStore();
    localStorage.clear();

    const url = new URL(window.location.href);
    url.pathname = "/";
    url.search = new URLSearchParams(window.location.search).toString();

    window.location.href = url.toString();
  }, [client]);

  return <main className="h-240" />;
}
