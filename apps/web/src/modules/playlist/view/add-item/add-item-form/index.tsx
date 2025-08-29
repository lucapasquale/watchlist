import { useLazyQuery, useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash/debounce.js";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputFormItem } from "@ui/components/form/input-form-item.js";
import { Button } from "@ui/components/ui/button.js";
import { DialogClose, DialogFooter } from "@ui/components/ui/dialog.js";
import { Form } from "@ui/components/ui/form.js";

import {
  AddItemUrlInformationDocument,
  CreatePlaylistItemDocument,
  PlaylistItemKind,
  PlaylistViewDocument,
} from "~common/graphql-types.js";
import { Route } from "~routes/playlist/$playlistID/index.js";

import { VideoPreview } from "./video-preview.js";

const schema = z.object({
  href: z.url(),
  timeRange: z.tuple([z.number().int().min(0), z.number().int().min(0)]).nullable(),
  videoInfo: z.object({
    kind: z.enum(PlaylistItemKind),
    embedUrl: z.url(),
    title: z.string().min(1),
    thumbnailUrl: z.url(),
    durationSeconds: z.number().int().nullish(),
  }),
});
export type FormValues = z.infer<typeof schema>;

type Props = {
  onAdd: () => void;
};

export function AddItemForm({ onAdd }: Props) {
  const { playlistID } = Route.useParams();

  const [getUrlInfo, { loading: urlLoading }] = useLazyQuery(AddItemUrlInformationDocument);
  const [createVideo, { loading }] = useMutation(CreatePlaylistItemDocument, {
    refetchQueries: [PlaylistViewDocument],
    awaitRefetchQueries: true,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { href: "", timeRange: [0, 0] },
  });

  const onUrlChange = debounce(async (href: string) => {
    if (!href) {
      return;
    }

    const [valid, response] = await Promise.all([
      form.trigger("href"),
      getUrlInfo({ variables: { input: { href } } }),
    ]);

    if (!valid) {
      // @ts-expect-error zod resolver doesn't support resetting value back to `undefined`
      form.setValue("videoInfo", undefined, { shouldValidate: true });
      return;
    }
    if (!response.data?.urlInformation) {
      form.setError("href", { type: "value", message: "No video found!" });
      // @ts-expect-error zod resolver doesn't support resetting value back to `undefined`
      form.setValue("videoInfo", undefined, { shouldValidate: true });
      return;
    }

    form.clearErrors();
    form.setValue("videoInfo", response.data.urlInformation, { shouldValidate: true });

    if (response.data.urlInformation.durationSeconds) {
      form.setValue("timeRange", [0, response.data.urlInformation.durationSeconds]);
    } else {
      form.setValue("timeRange", null);
    }
  }, 250);

  const onSubmit = async (values: FormValues) => {
    const hasCustomTimeRange =
      values.timeRange &&
      (values.timeRange[0] !== 0 || values.timeRange[1] !== values.videoInfo.durationSeconds);

    const { data } = await createVideo({
      variables: {
        input: {
          playlistID,
          href: values.href,
          startTimeSeconds:
            hasCustomTimeRange && values.timeRange ? values.timeRange[0] : undefined,
          endTimeSeconds: hasCustomTimeRange && values.timeRange ? values.timeRange[1] : undefined,
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
          className="flex w-full flex-col items-center gap-4"
        >
          <InputFormItem
            required
            disabled={urlLoading}
            control={form.control}
            name="href"
            label="Video link"
            placeholder="URL"
            onChange={(e) => onUrlChange(e.target.value)}
            className="w-full"
          />

          <VideoPreview loading={urlLoading} />
        </form>
      </Form>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="reset" variant="outline">
            Cancel
          </Button>
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
