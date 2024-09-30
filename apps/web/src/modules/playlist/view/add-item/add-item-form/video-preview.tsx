import React from "react";
import { useFormContext } from "react-hook-form";
import ReactPlayer from "react-player";
import { debounce } from "lodash";
import { SliderFormItem } from "@ui/components/form/slider-form-item";
import { Label } from "@ui/components/ui/label";
import { Skeleton } from "@ui/components/ui/skeleton";

import { PlaylistItemKind } from "~common/graphql-types";
import { formatDuration } from "~common/utils/time";

import { type FormValues } from ".";

type Props = {
  loading: boolean;
};

export function VideoPreview({ loading }: Props) {
  const form = useFormContext<FormValues>();

  const [previewUrl, _setPreviewUrl] = React.useState<string | null>(null);

  const videoInfo = form.watch("videoInfo");

  React.useEffect(() => {
    _setPreviewUrl(videoInfo?.url ?? null);
  }, [videoInfo]);

  const onTimeRangeChange = debounce((value: [number, number]) => {
    if (!videoInfo) {
      _setPreviewUrl(null);
      return;
    }

    const url = new URL(videoInfo.url);
    url.searchParams.set("start", String(value[0]));
    url.searchParams.set("end", String(value[1]));

    _setPreviewUrl(url.toString());
  }, 500);

  if (loading) {
    return <Skeleton className="w-full h-[325px]" />;
  }

  if (!videoInfo || !previewUrl) {
    return null;
  }

  return (
    <>
      <div className="w-full flex flex-col">
        <Label>Preview</Label>

        <div className="aspect-video mt-2 max-h-[310px]">
          <ReactPlayer controls url={previewUrl} width="100%" height="100%" />
        </div>
      </div>

      {videoInfo.kind === PlaylistItemKind.Youtube && (
        <SliderFormItem
          control={form.control}
          name="timeRange"
          min={0}
          max={videoInfo.durationSeconds}
          marks={getMarks(videoInfo.durationSeconds)}
          label="Video Range"
          formatValue={formatDuration}
          onValueChange={onTimeRangeChange}
        />
      )}
    </>
  );
}

function getMarks(totalDuration: number | null) {
  if (!totalDuration) {
    return undefined;
  }

  if (totalDuration < 10) {
    return [];
  }

  if (totalDuration < 60) {
    return Array.from({ length: totalDuration / 10 }, (_, i) => (i + 1) * 10).slice(0, -1);
  }

  if (totalDuration < 5 * 60) {
    return Array.from({ length: totalDuration / 30 }, (_, i) => (i + 1) * 30).slice(0, -1);
  }

  if (totalDuration < 10 * 60) {
    return Array.from({ length: totalDuration / 60 }, (_, i) => (i + 1) * 60).slice(0, -1);
  }

  if (totalDuration < 30 * 60) {
    return Array.from({ length: totalDuration / (5 * 60) }, (_, i) => (i + 1) * (5 * 60)).slice(
      0,
      -1,
    );
  }

  if (totalDuration < 60 * 60) {
    return Array.from({ length: totalDuration / (10 * 60) }, (_, i) => (i + 1) * (10 * 60)).slice(
      0,
      -1,
    );
  }

  if (totalDuration < 2 * 60 * 60) {
    return Array.from({ length: totalDuration / (30 * 60) }, (_, i) => (i + 1) * (30 * 60)).slice(
      0,
      -1,
    );
  }

  return [];
}
