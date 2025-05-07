import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { z } from "zod";
import { useLazyQuery, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Route } from "~routes/p/$playlistID/index.js";

import { VideoPreview } from "./video-preview.js";

const schema = z.object({
  rawUrl: z.string().url(),
  timeRange: z.tuple([z.number().int().min(0), z.number().int().min(0)]),
  videoInfo: z.object({
    kind: z.nativeEnum(PlaylistItemKind),
    url: z.string().url(),
    title: z.string().min(1),
    thumbnailUrl: z.string().url(),
    durationSeconds: z.number().int().positive(),
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
    defaultValues: { rawUrl: "", timeRange: [0, 0] },
  });

  const onUrlChange = debounce(async (rawUrl: string) => {
    if (!rawUrl) {
      return;
    }

    const [valid, response] = await Promise.all([
      form.trigger("rawUrl"),
      getUrlInfo({ variables: { input: { rawUrl } } }),
    ]);

    if (!valid) {
      // @ts-expect-error zod resolver doesn't support resetting value back to `undefined`
      form.setValue("videoInfo", undefined, { shouldValidate: true });
      return;
    }
    if (!response.data?.urlInformation) {
      form.setError("rawUrl", { type: "value", message: "No video found!" });
      // @ts-expect-error zod resolver doesn't support resetting value back to `undefined`
      form.setValue("videoInfo", undefined, { shouldValidate: true });
      return;
    }

    form.clearErrors();
    form.setValue("timeRange", [0, response.data.urlInformation.durationSeconds]);
    form.setValue("videoInfo", response.data.urlInformation, { shouldValidate: true });
  }, 250);

  const onSubmit = async (values: FormValues) => {
    const hasCustomTimeRange =
      values.timeRange[0] !== 0 || values.timeRange[1] !== values.videoInfo.durationSeconds;

    const { data } = await createVideo({
      variables: {
        input: {
          playlistID,
          rawUrl: values.rawUrl,
          startTimeSeconds: hasCustomTimeRange ? values.timeRange[0] : undefined,
          endTimeSeconds: hasCustomTimeRange ? values.timeRange[1] : undefined,
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
            onChange={(e) => onUrlChange(e.target.value)}
            className="w-full"
          />

          <VideoPreview loading={urlLoading} />
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
