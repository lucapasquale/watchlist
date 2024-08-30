import { Link } from "@tanstack/react-router";

import { Route } from "~routes/p/$playlistID/edit.lazy";

import { VideoList } from "./video-list";

export function Page() {
  const { playlistID } = Route.useParams();

  return (
    <section className="flex flex-col items-center px-8 gap-40">
      <Link to="/p/$playlistID" params={{ playlistID }}>
        Back
      </Link>

      <VideoList />
    </section>
  );
}
