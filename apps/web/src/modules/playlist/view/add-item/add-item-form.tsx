import React from "react";
import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";
import { z } from "zod";
import { useLazyQuery, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { SliderFormItem } from "@ui/components/form/slider-form-item";
import { Button } from "@ui/components/ui/button";
import { DialogClose, DialogFooter } from "@ui/components/ui/dialog";
import { Form } from "@ui/components/ui/form";

import {
  AddItemUrlInformationDocument,
  CreatePlaylistItemDocument,
  PlaylistViewDocument,
} from "~common/graphql-types";
import { Route } from "~routes/p/$playlistID/index";

const schema = z
  .object({
    rawUrl: z.string().url(),
    title: z.string().min(1),
    timeRange: z.tuple([z.number().positive(), z.number().positive()]),
  })
  .refine((data) => {
    if (data.timeRange) {
      return data.timeRange[0] < data.timeRange[1];
    }

    return true;
  });
type FormValues = z.infer<typeof schema>;

type Props = {
  onAdd: () => void;
};

export function AddItemForm({ onAdd }: Props) {
  const { playlistID } = Route.useParams();

  const [getUrlInfo, { data: urlData, loading: urlLoading }] = useLazyQuery(
    AddItemUrlInformationDocument,
  );
  const [createVideo, { loading }] = useMutation(CreatePlaylistItemDocument, {
    refetchQueries: [PlaylistViewDocument],
    awaitRefetchQueries: true,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rawUrl: "", timeRange: [0, 60] },
  });

  const onUrlBlur = async () => {
    const values = form.getValues();

    const [valid, response] = await Promise.all([
      form.trigger("rawUrl"),
      getUrlInfo({
        variables: {
          input: {
            rawUrl: values.rawUrl,
            ...(values.timeRange && {
              startTimeSeconds: values.timeRange[0],
              endTimeSeconds: values.timeRange[1],
            }),
          },
        },
      }),
    ]);

    if (!valid) {
      return;
    }
    if (!response.data?.urlInformation) {
      form.setError("rawUrl", { type: "value", message: "No video found!" });
      return;
    }

    if (response.data.urlInformation.durationSeconds) {
      form.setValue("timeRange", [0, response.data.urlInformation.durationSeconds]);
    }

    form.setValue("title", response.data.urlInformation.title, {
      shouldValidate: true,
    });
  };

  const timeRange = form.watch("timeRange");

  const previewUrl = React.useMemo(() => {
    if (!urlData?.urlInformation) {
      return null;
    }

    const url = new URL(urlData.urlInformation.url);
    if (urlData.urlInformation.durationSeconds) {
      url.searchParams.set("start", String(timeRange[0]));
      url.searchParams.set("end", String(timeRange[1]));
    }

    return url.toString();
  }, [urlData, timeRange]);

  const renderDuration = React.useCallback((durationSeconds: number) => {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }, []);

  const onSubmit = async (values: FormValues) => {
    const { data } = await createVideo({
      variables: {
        input: {
          playlistID,
          rawUrl: values.rawUrl,
          ...(values.timeRange && {
            startTimeSeconds: values.timeRange[0],
            endTimeSeconds: values.timeRange[1],
          }),
        },
      },
    });

    if (!data) {
      return;
    }

    onAdd();
  };

  return (
    <>
      <Form {...form}>
        <form
          id="add-playlist-item"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center gap-4"
        >
          <InputFormItem
            disabled={urlLoading}
            control={form.control}
            name="rawUrl"
            label="Video link"
            placeholder="URL"
            onBlur={onUrlBlur}
            className="w-full"
          />

          {previewUrl && (
            <div className="aspect-video max-h-[270px]">
              <ReactPlayer controls url={previewUrl} width="100%" height="100%" />
            </div>
          )}

          {urlData?.urlInformation?.durationSeconds && (
            <SliderFormItem
              disabled={urlLoading || !urlData?.urlInformation}
              control={form.control}
              name="timeRange"
              label="Time range"
              min={0}
              max={urlData?.urlInformation?.durationSeconds}
              minStepsBetweenThumbs={1}
              renderTooltipValue={renderDuration}
            />
          )}

          <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
        </form>
      </Form>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>

        <Button
          type="submit"
          form="add-playlist-item"
          disabled={!form.formState.isValid || loading}
        >
          Add
        </Button>
      </DialogFooter>
    </>
  );
}
