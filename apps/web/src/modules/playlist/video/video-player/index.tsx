import { Link, useRouter } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";
import React from "react";

import { Card, CardDescription, CardFooter, CardTitle } from "@ui/components/ui/card.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";
import { useComponentSize } from "@ui/hooks/use-component-size";

import { Player } from "~common/components/player";
import { PlaylistItemViewQuery } from "~common/graphql-types.js";
import { PLAYLIST_ITEM_KIND } from "~common/translations.js";
import { Route } from "~routes/playlist/$playlistID/$videoID";

import { PlayNextButton } from "./play-next-button";

type Props = {
  playlistItem: PlaylistItemViewQuery["playlistItem"];
};

export function VideoPlayer({ playlistItem }: Props) {
  const router = useRouter();
  const navigate = Route.useNavigate();

  const nextItemID = playlistItem.nextItem?.id;

  const [playing, setPlaying] = React.useState(true);
  const [failedToLoad, setFailedToLoad] = React.useState(false);

  const ref = React.useRef<HTMLDivElement>(null);
  const { height: playerSectionHeight } = useComponentSize(ref);

  const onVideoEnded = React.useCallback(() => {
    if (!nextItemID) {
      setPlaying(false);
      return;
    }

    navigate({
      to: "/playlist/$playlistID/$videoID",
      params: { playlistID: playlistItem.playlist.id, videoID: nextItemID },
      search: true,
    });
  }, [nextItemID, playlistItem.playlist.id, navigate]);

  const onVideoError = React.useCallback((error: MediaError | null) => {
    /** User denied autoplay or browser didn't allow it yet, ignore and wait for manual play */
    if (error?.message?.includes("user denied permission")) {
      return;
    }

    setFailedToLoad?.(true);
  }, []);

  React.useEffect(() => {
    if (!nextItemID) {
      return;
    }

    router
      .preloadRoute({
        to: "/playlist/$playlistID/$videoID",
        params: { playlistID: playlistItem.playlist.id, videoID: nextItemID },
        search: true,
      })
      .catch(() => {});
  }, [router, playlistItem, nextItemID]);

  React.useEffect(() => {
    setPlaying(true);
    setFailedToLoad(false);
  }, [playlistItem.id]);

  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--player-section-height",
      `${playerSectionHeight}px`,
    );
  }, [playerSectionHeight]);

  return (
    <section ref={ref} className="z-10 flex h-fit w-full flex-col items-center gap-4">
      <div className="sticky top-[106px] flex h-[231.75px] w-full justify-center sm:static md:h-[481.5px] 2xl:h-[625.5px]">
        <Player
          key={playlistItem.id}
          playing={playing}
          video={playlistItem}
          onVideoEnded={onVideoEnded}
          onVideoError={onVideoError}
        />
      </div>

      <Card className="bg-card flex w-full flex-row items-center justify-between gap-1 rounded-xl">
        <div className="ml-6">
          <CardTitle>
            <h1
              title={playlistItem.title}
              className="line-clamp-2 text-lg leading-relaxed md:text-2xl"
            >
              {playlistItem.title}
            </h1>
          </CardTitle>

          <Link target="_blank" rel="noopener noreferrer" to={playlistItem.href}>
            <CardDescription className="mt-2 flex items-center gap-2">
              {playlistItem.originalPosterName} • {PLAYLIST_ITEM_KIND[playlistItem.kind]}
              <LinkIcon className="size-3" />
            </CardDescription>
          </Link>
        </div>

        <CardFooter className="py-0">
          <PlayNextButton
            playlistID={playlistItem.playlist.id}
            nextItemID={nextItemID}
            failedToLoad={failedToLoad}
          />
        </CardFooter>
      </Card>
    </section>
  );
}

VideoPlayer.Skeleton = () => (
  <section className="flex flex-col gap-6">
    <Skeleton className="aspect-video h-[619px]" />
    <Skeleton className="h-[110px]" />
  </section>
);
