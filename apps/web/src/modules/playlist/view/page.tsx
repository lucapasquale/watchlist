import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";

import { PlaylistViewDocument } from "~common/graphql-types";
import { useCurrentUser } from "~common/providers/current-user-provider";
import { Route } from "~routes/p/$playlistID/index";

import { AddItem } from "./add-item";
import { PlaylistInfo } from "./playlist-info";
import { SortableItems } from "./sortable-items";

export function Page() {
  const { playlistID } = Route.useParams();
  const { user } = useCurrentUser();

  const { data } = useQuery(PlaylistViewDocument, {
    variables: { playlistID },
    notifyOnNetworkStatusChange: true,
  });

  if (!data) {
    return (
      <main className="grid items-start grid-cols-1 xl:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
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

      <main className="grid items-start grid-cols-1 xl:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
        <div className="flex flex-col gap-4">
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
