import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";
import { Separator } from "@ui/components/ui/separator";
import { Skeleton } from "@ui/components/ui/skeleton";

import { VideoKindBadge } from "~components/VideoKindBadge";
import { Route } from "~routes/p/$playlistID/$videoID";

import { gql } from "../../../../__generated__";

const PLAYLIST_ITEM_SIDEBAR_QUERY = gql(/* GraphQL */ `
  query PlaylistItemQueueSidebar($playlistID: ID!) {
    playlist(id: $playlistID) {
      id
      name

      items {
        id
        kind
        title
        thumbnailUrl
      }
    }
  }
`);

export function QueueSidebar() {
  const search = Route.useSearch();
  const { playlistID } = Route.useParams();

  const { data } = useQuery(PLAYLIST_ITEM_SIDEBAR_QUERY, {
    variables: { playlistID },
  });

  if (!data) {
    return <Skeleton />;
  }

  return (
    <aside className="flex flex-col gap-6 rounded-md bg-gray-700 p-4">
      <div>
        <Link
          to="/p/$playlistID"
          params={{ playlistID: playlistID.toString() }}
          className="text-xl"
        >
          {data.playlist.name}
        </Link>

        {search.shuffleSeed && <>- Shuffle</>}
      </div>

      <Separator className="bg-primary" />

      <ol className="flex flex-col gap-3">
        {data.playlist.items.map((playlistItem) => (
          <li key={playlistItem.id}>
            <Link
              search
              to="/p/$playlistID/$videoID"
              params={{ playlistID: playlistID.toString(), videoID: playlistItem.id.toString() }}
              className="flex items-center gap-2"
            >
              <img
                src={playlistItem.thumbnailUrl}
                className="w-[100px] h-[56px] aspect-video rounded-md"
              />

              <div className="flex flex-col gap-1">
                <h1 className="text-lg">{playlistItem.title}</h1>

                <VideoKindBadge kind={playlistItem.kind} />
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
