import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: () => {
    throw redirect({
      to: "/playlists/$playlistID",
      params: { playlistID: "1" },
    });
  },
});
