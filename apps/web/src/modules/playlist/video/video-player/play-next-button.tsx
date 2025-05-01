import "./play-next-button.css";

import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";
import { SkipForward } from "lucide-react";

type Props = {
  playlistID: string;
  nextItemID: string | undefined;
  failedToLoad: boolean;
};

export function PlayNextButton({ playlistID, nextItemID, failedToLoad }: Props) {
  return (
    <Link
      search
      to="/p/$playlistID/$videoID"
      params={{ playlistID, videoID: nextItemID ?? "" }}
      disabled={!nextItemID}
    >
      <Button id="main-button" className="relative" data-skip={failedToLoad} disabled={!nextItemID}>
        <Button
          id="hold-overlay"
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-full bg-red-400 hover:bg-red-400 transition-[clip-path] [clip-path:inset(0px_100%_0px_0px)]"
          disabled={!nextItemID}
        >
          <SkipForward className="size-4" />
          Next
        </Button>
        <SkipForward className="size-4" />
        Next
      </Button>
    </Link>
  );
}
