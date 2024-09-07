import React from "react";
import { Helmet } from "react-helmet-async";
import ReactPlayer from "react-player/lazy";
import { useQuery } from "@apollo/client";
import { Skeleton } from "@ui/components/ui/skeleton";

import { PlaylistItemViewDocument } from "~common/graphql-types";
import { Route } from "~routes/p/$playlistID/$videoID";

import { type NextButtonKind, VideoToolbar } from "./video-toolbar";

export function VideoPlayer() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { playlistID, videoID } = Route.useParams();

  const [nextButtonKind, setNextButtonKind] = React.useState<NextButtonKind>("loading");

  const { data } = useQuery(PlaylistItemViewDocument, {
    variables: { playlistItemID: videoID, shuffleSeed: search.shuffleSeed },
    onCompleted: () => {
      setNextButtonKind("user-input");
    },
  });

  React.useEffect(() => {
    setNextButtonKind("loading");
  }, [videoID]);

  const onVideoEnded = () => {
    if (data?.playlistItem.nextItem) {
      navigate({
        to: "/p/$playlistID/$videoID",
        params: { playlistID, videoID: data.playlistItem.nextItem.id },
        search: true,
      });
    }
  };

  if (!data) {
    return (
      <section className="flex flex-col gap-6">
        <Skeleton className="aspect-video w-[912px] h-[619px]" />
        <Skeleton className="h-[62px]" />
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {data.playlistItem.title} • {data.playlistItem.playlist.name}
        </title>
      </Helmet>

      <section className="w-full flex flex-col items-center gap-6">
        <ReactPlayer
          key={data.playlistItem.id}
          playing
          controls
          width="100%"
          height="100%"
          url={data.playlistItem.url}
          onEnded={onVideoEnded}
          onError={(...args) => {
            console.error("Failed to load video", ...args);
            setNextButtonKind("auto-forward");
          }}
          style={{ aspectRatio: "16 / 9", width: "100%", maxWidth: "912px", maxHeight: "619px" }}
        />

        <VideoToolbar playlistItem={data.playlistItem} nextButtonKind={nextButtonKind} />
      </section>
    </>
  );
}
