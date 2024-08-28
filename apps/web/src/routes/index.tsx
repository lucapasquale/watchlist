import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: () => {
    throw redirect({
      to: "/p/$playlistID",
      params: { playlistID: "1" },
    });
  },
});
