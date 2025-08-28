import { useApolloClient } from "@apollo/client/react";
import { useNavigate } from "@tanstack/react-router";
import React from "react";

export function Page() {
  const navigate = useNavigate();
  const client = useApolloClient();

  React.useEffect(() => {
    client.clearStore();
    localStorage.clear();

    navigate({ to: "/", search: {}, reloadDocument: true });
  }, [client, navigate]);

  return <main className="h-240" />;
}
