import React from "react";
import { useForm } from "react-hook-form";
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
import { PLAYLIST_ITEM_KIND } from "~common/translations";
import { Route } from "~routes/p/$playlistID/index";

const schema = z
  .object({
    rawUrl: z.string().url(),
    title: z.string().min(1),
    timeRange: z.tuple([z.number().positive(), z.number().positive()]).optional(),
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

  const onBlur = async () => {
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

    form.setValue("title", response.data.urlInformation.title, {
      shouldValidate: true,
    });
  };

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
          onBlur={onBlur}
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center gap-4"
        >
          <InputFormItem
            disabled={urlLoading}
            control={form.control}
            name="rawUrl"
            label="Add new URL from video"
            placeholder="URL"
            className="w-full"
          />

          <SliderFormItem
            control={form.control}
            name="timeRange"
            label="Time range"
            min={0}
            max={100}
            minStepsBetweenThumbs={1}
          />
        </form>
      </Form>

      {urlData?.urlInformation ? (
        <div className="flex items-center gap-2">
          <img
            src={urlData.urlInformation.thumbnailUrl}
            className="w-[160px] h-[90px] rounded-md"
          />

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl">{urlData.urlInformation.title}</h1>

            {PLAYLIST_ITEM_KIND[urlData.urlInformation.kind]}
          </div>
        </div>
      ) : (
        <div className="h-[90px]" />
      )}

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
