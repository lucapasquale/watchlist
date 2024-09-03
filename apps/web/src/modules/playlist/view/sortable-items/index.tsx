import { useQuery } from "@apollo/client";

import { PlaylistSortableItemsDocument } from "~graphql/types";
import { Route } from "~routes/p/$playlistID/index.lazy";

import { VirtualList } from "./virtual-list";

export function SortableItems() {
  const { playlistID } = Route.useParams();

  const { data } = useQuery(PlaylistSortableItemsDocument, {
    variables: { playlistID },
  });

  if (!data?.playlist) {
    return null;
  }

  return <VirtualList playlist={data.playlist} />;
}
