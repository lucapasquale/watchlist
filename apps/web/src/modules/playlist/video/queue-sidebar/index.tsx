import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";
import { Separator } from "@ui/components/ui/separator";
import { Skeleton } from "@ui/components/ui/skeleton";

import { Route } from "~routes/p/$playlistID/$videoID";

import { PlaylistItemQueueSidebarDocument } from "../../../../graphql/types";

export function QueueSidebar() {
  const search = Route.useSearch();
  const { playlistID, videoID } = Route.useParams();

  const { data } = useQuery(PlaylistItemQueueSidebarDocument, {
    variables: { playlistID, shuffleSeed: search.shuffleSeed },
  });

  const refs = React.useMemo(() => {
    if (!data) {
      return {};
    }

    return data.playlist.items.reduce(
      (acc, value) => {
        acc[value.id] = React.createRef<HTMLLIElement>();
        return acc;
      },
      {} as Record<string, React.RefObject<HTMLLIElement>>,
    );
  }, [data]);

  React.useEffect(() => {
    if (!refs[videoID]?.current) {
      return;
    }

    refs[videoID].current.scrollIntoView({ behavior: search.shuffleSeed ? "instant" : "smooth" });
  }, [refs, search.shuffleSeed, videoID]);

  if (!data) {
    return <Skeleton />;
  }

  return (
    <aside className="flex flex-col gap-6 rounded-md bg-gray-700 p-4 max-h-[700px]">
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

      <ol className="flex flex-col gap-3 overflow-x-hidden overflow-y-scroll">
        {data.playlist.items.map((playlistItem, idx) => (
          <li key={playlistItem.id} ref={refs[playlistItem.id]}>
            <Link
              search
              to="/p/$playlistID/$videoID"
              params={{ playlistID: playlistID.toString(), videoID: playlistItem.id.toString() }}
              className="flex items-center gap-3"
            >
              <p className="text-xs">{idx + 1}</p>

              <img
                src={playlistItem.thumbnailUrl}
                className="w-[100px] h-[56px] aspect-video rounded-md"
              />

              <h1 title={playlistItem.title} className="line-clamp-2">
                {playlistItem.title}
              </h1>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
