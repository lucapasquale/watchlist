import React from "react";
import { useQuery } from "@apollo/client";

import { PlaylistViewDocument } from "~graphql/types";
import { Route } from "~routes/p/$playlistID/index.lazy";

import { AddItem } from "./add-item";
import { PlaylistInfo } from "./playlist-info";
import { SortableItems } from "./sortable-items";

export function Page() {
  const { playlistID } = Route.useParams();
  const shuffleSeed = React.useRef(Date.now().toString());

  const { data } = useQuery(PlaylistViewDocument, {
    variables: { playlistID, shuffleSeed: shuffleSeed.current },
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <main className="grid items-start grid-cols-1 xl:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
      <div className="flex flex-col gap-4">
        <PlaylistInfo playlist={data.playlist} shuffleSeed={shuffleSeed.current} />

        <AddItem />
      </div>

      <SortableItems />
    </main>
  );
}
