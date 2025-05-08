import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";

import { PlaylistViewDocument } from "~common/graphql-types.js";
import { useCurrentUser } from "~common/providers/current-user-provider.js";
import { Route } from "~routes/p/$playlistID/index.js";

import { AddItem } from "./add-item/index.js";
import { PlaylistInfo } from "./playlist-info/index.js";
import { SortableItems } from "./sortable-items/index.js";

export function Page() {
  const { playlistID } = Route.useParams();
  const { user } = useCurrentUser();

  const { data } = useQuery(PlaylistViewDocument, {
    variables: { playlistID },
    notifyOnNetworkStatusChange: true,
  });

  if (!data) {
    return (
      <main className="container mx-auto px-2 sm:px-0 my-2 grid items-start grid-cols-1 lg:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
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

      <main className="container mx-auto px-2 sm:px-0 my-2 grid items-start grid-cols-1 lg:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
        <div className="mt-2 flex flex-col gap-4">
          <PlaylistInfo playlist={data.playlist} isOwner={isOwner} />

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
