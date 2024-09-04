import React from "react";
import { useAnimate } from "framer-motion";
import { LinkIcon, SkipForward } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";

import { PlaylistItemKindBadge } from "~components/playlist-item-kind-badge";
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
    <div className="w-full flex items-center justify-between gap-8 rounded-xl bg-card px-4 py-6">
      <div className="flex flex-col gap-2">
        <Link target="_blank" rel="noopener noreferrer" to={playlistItem.rawUrl}>
          <h1 className="flex items-baseline gap-2 text-2xl hover:underline">
            {playlistItem.title}

            <LinkIcon className="size-4" />
          </h1>
        </Link>

        <PlaylistItemKindBadge kind={playlistItem.kind} />
      </div>

      <Link search to="/p/$playlistID/$videoID" params={{ playlistID, videoID: nextItemID ?? "" }}>
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
    </div>
  );
}
