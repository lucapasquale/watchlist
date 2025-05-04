import React from "react";
import { Helmet } from "react-helmet-async";
import ReactPlayer from "react-player/lazy";
import { LinkIcon } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { Card, CardDescription, CardFooter, CardTitle } from "@ui/components/ui/card.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";

import { PlaylistItemViewQuery } from "~common/graphql-types.js";
import { PLAYLIST_ITEM_KIND } from "~common/translations.js";
import { Route } from "~routes/p/$playlistID/$videoID.js";
import { PlayNextButton } from "./play-next-button";

type Props = {
  playlistItem: PlaylistItemViewQuery["playlistItem"];
};

export function VideoPlayer({ playlistItem }: Props) {
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

      <section className="w-full flex flex-col items-center gap-6">
        <ReactPlayer
          key={playlistItem.id}
          playing
          controls
          width="100%"
          height="100%"
          url={playlistItem.url}
          onError={onError}
          onEnded={navigateToNextVideo}
          style={{ aspectRatio: "16 / 9", width: "100%", maxWidth: "912px", maxHeight: "619px" }}
        />

        <Card className="w-full flex flex-row items-center justify-between gap-1 rounded-xl bg-card">
          <div className="ml-6">
            <CardTitle>
              <Link target="_blank" rel="noopener noreferrer" to={playlistItem.rawUrl}>
                <h1 className="text-lg md:text-2xl">
                  {playlistItem.title}

                  <LinkIcon className="inline size-4 ml-2" />
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
