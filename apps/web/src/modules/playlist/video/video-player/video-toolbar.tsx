import React from "react";
import { useAnimate } from "framer-motion";
import { LinkIcon, SkipForward } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";

import { PLAYLIST_ITEM_KIND } from "~common/translations";
import { PlaylistItemViewQuery } from "~graphql/types";
import { Route } from "~routes/p/$playlistID/$videoID";

export type NextButtonKind = "loading" | "user-input" | "auto-forward";

type Props = {
  nextButtonKind: NextButtonKind;
  playlistItem: PlaylistItemViewQuery["playlistItem"];
};

export function VideoToolbar({ nextButtonKind, playlistItem }: Props) {
  const navigate = Route.useNavigate();
  const { playlistID } = Route.useParams();

  const [scope, animate] = useAnimate<HTMLButtonElement>();

  const nextItemID = playlistItem.nextItem?.id;

  React.useEffect(() => {
    if (!nextItemID || nextButtonKind !== "auto-forward") {
      return;
    }

    animate(
      scope.current,
      { backgroundPositionX: "0%" },
      {
        duration: 3,
        onComplete: () => {
          navigate({
            to: "/p/$playlistID/$videoID",
            params: { playlistID, videoID: nextItemID },
            search: true,
          });
        },
      },
    );
  }, [animate, scope, nextItemID, navigate, playlistID, nextButtonKind]);

  return (
    <Card className="w-full flex items-center justify-between gap-1 rounded-xl bg-card">
      <CardHeader>
        <CardTitle>
          <Link target="_blank" rel="noopener noreferrer" to={playlistItem.rawUrl}>
            <h1 className="text-lg md:text-2xl hover:underline">
              {playlistItem.title}

              <LinkIcon className="inline ml-2 size-4" />
            </h1>
          </Link>
        </CardTitle>

        <CardDescription>{PLAYLIST_ITEM_KIND[playlistItem.kind]}</CardDescription>
      </CardHeader>

      <CardFooter className="py-0">
        <Link
          search
          to="/p/$playlistID/$videoID"
          params={{ playlistID, videoID: nextItemID ?? "" }}
        >
          <Button
            disabled={!nextItemID}
            ref={scope}
            className="flex items-center gap-2"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(346.8 77.2% 49.8%) 50%, hsl(346.8 77.2% 19.8%) 50%)",
              backgroundPositionY: "0%",
              backgroundPositionX: nextButtonKind === "auto-forward" ? "100%" : "0%",
              backgroundSize: "200% 100%",
            }}
          >
            Next
            <SkipForward className="size-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
