import { Link, useRouter } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";
import React from "react";
import { Helmet } from "react-helmet-async";
import ReactPlayer from "react-player/lazy";

import { Card, CardDescription, CardFooter, CardTitle } from "@ui/components/ui/card.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";

import { PlaylistItemViewQuery } from "~common/graphql-types.js";
import { PLAYLIST_ITEM_KIND } from "~common/translations.js";
import { Route } from "~routes/p/$playlistID/$videoID.js";

import { PlayNextButton } from "./play-next-button";

type Props = {
  ref?: React.Ref<HTMLElement>;
  playlistItem: PlaylistItemViewQuery["playlistItem"];
};

export function VideoPlayer({ playlistItem, ref }: Props) {
  const router = useRouter();
  const navigate = Route.useNavigate();

  const [failedToLoad, setFailedToLoad] = React.useState(false);
  const nextItemID = playlistItem.nextItem?.id;

  React.useEffect(() => {
    if (!nextItemID) {
      return;
    }

    router
      .preloadRoute({
        to: "/p/$playlistID/$videoID",
        params: { playlistID: playlistItem.playlist.id, videoID: nextItemID },
        search: true,
      })
      .catch(() => {});
  }, [router, playlistItem, nextItemID]);

  React.useEffect(() => {
    setFailedToLoad(false);
  }, [playlistItem.id]);

  const onError = (error: Error, _data?: any, _hlsInstance?: any, _hlsGlobal?: any) => {
    /** User denied autoplay or browser didn't allow it yet, ignore and wait for manual play */
    if (error?.message?.includes("user denied permission")) {
      return;
    }

    setFailedToLoad(true);
  };

  const navigateToNextVideo = () => {
    if (!nextItemID) {
      return;
    }

    navigate({
      to: "/p/$playlistID/$videoID",
      params: { playlistID: playlistItem.playlist.id, videoID: nextItemID },
      search: true,
    });
  };

  return (
    <>
      <Helmet>
        <title>
          {playlistItem.title} • {playlistItem.playlist.name}
        </title>
      </Helmet>

      <section ref={ref} className="z-10 flex h-auto w-full flex-col items-center gap-4">
        <div className="sticky top-[106px] flex max-h-[912px] w-full justify-center sm:static">
          <ReactPlayer
            key={playlistItem.id}
            playing
            controls
            width="100%"
            height="100%"
            url={playlistItem.url}
            onError={onError}
            onEnded={navigateToNextVideo}
            style={{ aspectRatio: "16 / 9", width: "100%" }}
          />
        </div>

        <Card className="bg-card flex w-full flex-row items-center justify-between gap-1 rounded-xl">
          <div className="ml-6">
            <CardTitle>
              <Link target="_blank" rel="noopener noreferrer" to={playlistItem.rawUrl}>
                <h1 className="text-lg md:text-2xl">
                  {playlistItem.title}

                  <LinkIcon className="ml-2 inline size-4" />
                </h1>
              </Link>
            </CardTitle>

            <CardDescription className="mt-2">
              {PLAYLIST_ITEM_KIND[playlistItem.kind]}
            </CardDescription>
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
    </>
  );
}

VideoPlayer.Skeleton = () => (
  <section className="flex flex-col gap-6">
    <Skeleton className="aspect-video h-[619px]" />
    <Skeleton className="h-[110px]" />
  </section>
);
