import React from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";
import { Skeleton } from "@ui/components/ui/skeleton";

import { useCurrentUser } from "~common/providers/current-user-provider";
import { PlaylistViewDocument } from "~common/graphql-types";
import { Route } from "~routes/p/$playlistID/index.lazy";

import { AddItem } from "./add-item";
import { PlaylistInfo } from "./playlist-info";
import { SortableItems } from "./sortable-items";

export function Page() {
  const { playlistID } = Route.useParams();
  const { user } = useCurrentUser();

  const shuffleSeed = React.useRef(Date.now().toString());

  const { data } = useQuery(PlaylistViewDocument, {
    variables: { playlistID, shuffleSeed: shuffleSeed.current },
    notifyOnNetworkStatusChange: true,
  });

  if (!data) {
    return (
      <main className="grid items-start grid-cols-1 xl:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
        <section className="flex flex-col gap-4">
          <Skeleton className="h-[256px]" />
          <Skeleton className="h-10 w-[120px] self-end" />
        </section>

        <section className="w-full h-[975px] overflow-y-scroll flex flex-col gap-2">
          <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
          <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
          <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
          <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
          <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
          <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
          <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
          <Skeleton className="h-[122px] bg-card flex-none rounded-xl" />
        </section>
      </main>
    );
  }

  const isOwner = data.playlist.user.id === user?.id;

  return (
    <>
      <Helmet>
        <title>watchlist • {data.playlist.name}</title>
      </Helmet>

      <main className="grid items-start grid-cols-1 xl:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
        <div className="flex flex-col gap-4">
          <PlaylistInfo playlist={data.playlist} shuffleSeed={shuffleSeed.current} />

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
