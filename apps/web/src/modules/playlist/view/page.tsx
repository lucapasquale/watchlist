import { useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";

import { PlaylistViewDocument } from "~common/graphql-types.js";
import { useCurrentUser } from "~common/providers/current-user-provider.js";
import { Route } from "~routes/playlist/$playlistID/index.js";

import { AddItem } from "./add-item/index.js";
import { PlaylistInfo } from "./playlist-info/index.js";
import { SortableItems } from "./sortable-items/index.js";

export function Page() {
  const { playlistID } = Route.useParams();
  const shuffleSeed = React.useRef(Date.now().toString());

  const { user } = useCurrentUser();

  const { data } = useQuery(PlaylistViewDocument, {
    variables: { playlistID, shuffleSeed: shuffleSeed.current },
    notifyOnNetworkStatusChange: true,
  });

  if (!data) {
    return (
      <main className="container mx-auto mb-2 grid grid-cols-1 items-start gap-4 px-2 sm:my-2 sm:gap-6 sm:px-0 lg:grid-cols-[minmax(min(350px,100%),_1fr)_3fr]">
        <section className="flex flex-col gap-4">
          <PlaylistInfo.Skeleton />
          <AddItem.Skeleton />
        </section>

        <SortableItems.Skeleton />
      </main>
    );
  }

  const isOwner = data.playlist.user.id === user?.id;

  return (
    <>
      <Helmet>
        <title>watchlist • {data.playlist.name}</title>
      </Helmet>

      <main className="container mx-auto mb-2 grid grid-cols-1 items-start gap-4 px-2 sm:my-2 sm:gap-6 sm:px-0 lg:grid-cols-[minmax(min(350px,100%),_1fr)_3fr]">
        <div className="mt-2 flex flex-col gap-4">
          <PlaylistInfo
            playlist={data.playlist}
            shuffleSeed={shuffleSeed.current}
            isOwner={isOwner}
          />

          {isOwner && <AddItem />}
        </div>

        <SortableItems
          key={data.playlist.items.length}
          playlist={data.playlist}
          isOwner={isOwner}
        />
      </main>
    </>
  );
}
