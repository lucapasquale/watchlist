import { Link } from "@tanstack/react-router";
import { timeToDuration } from "@workspace/helpers/duration";
import { cn } from "@workspace/ui/lib/utils";
import { RowComponentProps } from "react-window";

import { PlaylistItemViewQuery } from "~common/graphql-types.js";

type Props = {
  items: PlaylistItemViewQuery["playlistItem"]["playlist"]["items"];
  currentItemIndex: number;
  playlistID: string;
};

export function PlaylistItem({
  items,
  index,
  currentItemIndex,
  playlistID,
  style,
}: RowComponentProps<Props>) {
  const item = items[index];
  const isActive = currentItemIndex === index;

  return (
    <li
      key={item.id}
      style={style}
      className={cn(
        "hover:bg-primary/70 h-16 w-full list-none px-2 py-1",
        isActive && "bg-primary",
      )}
    >
      <Link
        search
        to="/playlist/$playlistID/$videoID"
        params={{
          playlistID: playlistID.toString(),
          videoID: item.id.toString(),
        }}
        className="flex items-center gap-3 hover:no-underline"
      >
        <p className="min-w-4 text-center text-xs">{index + 1}</p>

        <div className="relative aspect-video h-[56px] w-[100px] overflow-clip rounded-md bg-black">
          <img src={item.thumbnailUrl} alt={item.title} className="w-full object-center" />

          {item.durationSeconds && (
            <div className="absolute bottom-1 right-1 z-10 rounded-md bg-black/50 px-1 py-[1px] text-xs">
              {timeToDuration(item.durationSeconds)}
            </div>
          )}
        </div>

        <h1 title={item.title} className={cn("line-clamp-2", isActive && "font-bold")}>
          {item.title}
        </h1>
      </Link>
    </li>
  );
}
