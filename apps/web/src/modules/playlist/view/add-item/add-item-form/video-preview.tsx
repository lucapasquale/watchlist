import { debounce } from "lodash";
import React from "react";
import { useFormContext } from "react-hook-form";

import { SliderFormItem } from "@ui/components/form/slider-form-item.js";
import { Label } from "@ui/components/ui/label.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";

import { Player } from "~common/components/player/index.js";
import { PlaylistItemKind } from "~common/graphql-types.js";
import { formatDuration } from "~common/utils/time.js";

import { type FormValues } from "./index.js";

type Props = {
  loading: boolean;
};

export function VideoPreview({ loading }: Props) {
  const form = useFormContext<FormValues>();

  const [embedUrl, _setEmbedUrl] = React.useState<string | null>(null);

  const videoInfo = form.watch("videoInfo");

  React.useEffect(() => {
    _setEmbedUrl(videoInfo?.embedUrl ?? null);
  }, [videoInfo]);

  const onTimeRangeChange = debounce((value: [number, number]) => {
    if (!videoInfo) {
      _setEmbedUrl(null);
      return;
    }

    if (videoInfo.kind !== PlaylistItemKind.Youtube) {
      return;
    }

    const url = new URL(videoInfo.embedUrl);
    url.searchParams.set("start", String(value[0]));
    url.searchParams.set("end", String(value[1]));

    _setEmbedUrl(url.toString());
  }, 500);

  if (loading) {
    return <Skeleton className="h-[325px] w-full" />;
  }

  if (!videoInfo || !embedUrl) {
    return null;
  }

  return (
    <>
      <div className="flex w-full flex-col">
        <Label>Preview</Label>

        <div className="mt-2 aspect-video max-h-[310px]">
          <Player video={{ ...videoInfo, embedUrl }} />
        </div>
      </div>

      {videoInfo.kind === PlaylistItemKind.Youtube && (
        <SliderFormItem
          control={form.control}
          name="timeRange"
          min={0}
          max={videoInfo.durationSeconds}
          marks={getMarks(videoInfo.durationSeconds)}
          label="Time Range"
          formatValue={formatDuration}
          onValueChange={onTimeRangeChange}
        />
      )}
    </>
  );
}

const durationMarkConfigs = [
  {
    maxDuration: 60,
    interval: 10,
  },
  {
    maxDuration: 5 * 60,
    interval: 30,
  },
  {
    maxDuration: 10 * 60,
    interval: 60,
  },
  {
    maxDuration: 30 * 60,
    interval: 5 * 60,
  },
  {
    maxDuration: 60 * 60,
    interval: 10 * 60,
  },
  {
    maxDuration: 2 * 60 * 60,
    interval: 30 * 60,
  },
];

function getMarks(totalDuration: number | null) {
  if (!totalDuration) {
    return undefined;
  }

  if (totalDuration < 10) {
    return [];
  }

  const durationMarks = durationMarkConfigs.find(({ maxDuration }) => totalDuration < maxDuration);
  if (!durationMarks) {
    return [];
  }

  const allMarks = Array.from(
    { length: totalDuration / durationMarks.interval },
    (_, i) => (i + 1) * durationMarks.interval,
  );

  // Hide last mark so it doesn't overlap with the end of the slider
  return allMarks.slice(0, -1);
}
