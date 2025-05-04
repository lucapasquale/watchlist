import React from "react";
import { Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { SkipForward } from "lucide-react";
import { cn } from "@ui/lib/utils";

type Props = {
  playlistID: string;
  nextItemID: string | undefined;
  failedToLoad: boolean;
};

export function PlayNextButton({ playlistID, nextItemID, failedToLoad }: Props) {
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const insetButtonRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!linkRef.current || !insetButtonRef.current || !nextItemID) {
      return;
    }

    const handleTransitionEnd = () => {
      linkRef.current?.click();
    };

    insetButtonRef.current.addEventListener("transitionend", handleTransitionEnd);

    return () => {
      insetButtonRef.current?.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [playlistID, nextItemID]);

  return (
    <Link
      search
      ref={linkRef}
      to="/p/$playlistID/$videoID"
      params={{ playlistID, videoID: nextItemID ?? "" }}
      disabled={!nextItemID}
    >
      <Button
        disabled={!nextItemID}
        data-skip={failedToLoad}
        // https://emilkowal.ski/ui/building-a-hold-to-delete-component
        className="relative enabled:data-[skip=true]:bg-red-300 enabled:data-[skip=true]:*:aria-hidden:[transition:clip-path_2s_linear] enabled:data-[skip=true]:*:aria-hidden:[clip-path:inset(0px_0px_0px_0px)]"
      >
        <div
          aria-hidden="true"
          ref={insetButtonRef}
          className={cn(
            "absolute top-0 left-0 w-full h-full [transition:clip-path_0ms_ease-out] [clip-path:inset(0px_100%_0px_0px)]",
            buttonVariants({ variant: "default", size: "default" }),
          )}
        >
          <SkipForward className="size-4" />
          Next
        </div>
        <SkipForward className="size-4" />
        Next
      </Button>
    </Link>
  );
}
