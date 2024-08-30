import { Link } from "@tanstack/react-router";
import { Separator } from "@ui/components/ui/separator";
import { Skeleton } from "@ui/components/ui/skeleton";

import { VideoKindBadge } from "~components/VideoKindBadge";
import { Route } from "~routes/p/$playlistID/$videoID";
import { RouterOutput, trpc } from "~utils/trpc";

type Props = {
  playlistID: number;
  queue: RouterOutput["getPlaylistQueue"] | undefined;
};

export function QueueSidebar({ playlistID, queue }: Props) {
  const search = Route.useSearch();

  const playlist = trpc.getPlaylist.useQuery(playlistID);

  if (!playlist.data) {
    return <Skeleton />;
  }

  return (
    <aside className="flex flex-col gap-6 m-2 rounded-md bg-gray-700 p-4">
      <div>
        <Link
          to="/p/$playlistID"
          params={{ playlistID: playlistID.toString() }}
          className="text-xl"
        >
          {playlist.data.name}
        </Link>

        {search.shuffleSeed && <>- Shuffle</>}
      </div>

      <Separator className="bg-primary" />

      <ol className="flex flex-col gap-3">
        {queue?.map((video) => (
          <li key={video.id}>
            <Link
              search
              to="/p/$playlistID/$videoID"
              params={{ playlistID: playlistID.toString(), videoID: video.id.toString() }}
              className="flex items-center gap-2"
            >
              <img
                src={video.thumbnail_url}
                className="w-[100px] h-[56px] aspect-video rounded-md"
              />

              <div className="flex flex-col gap-1">
                <h1 className="text-lg">{video.title}</h1>

                <VideoKindBadge videoKind={video.kind} />
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
