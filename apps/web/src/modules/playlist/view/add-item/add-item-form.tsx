import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";
import { z } from "zod";
import { useLazyQuery, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";
import { DialogClose, DialogFooter } from "@ui/components/ui/dialog";
import { Form } from "@ui/components/ui/form";
import { Label } from "@ui/components/ui/label";

import {
  AddItemUrlInformationDocument,
  CreatePlaylistItemDocument,
  PlaylistItemKind,
  PlaylistViewDocument,
} from "~common/graphql-types";
import { Route } from "~routes/p/$playlistID/index";

const schema = z.object({
  rawUrl: z.string().url(),
  videoInfo: z.object({
    kind: z.nativeEnum(PlaylistItemKind),
    url: z.string().url(),
    title: z.string().min(1),
    thumbnailUrl: z.string().url(),
    durationSeconds: z.number().int().positive().nullish(),
  }),
});
type FormValues = z.infer<typeof schema>;

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
    defaultValues: { rawUrl: "" },
  });

  const videoInfo = form.watch("videoInfo");

  const onUrlBlur = async () => {
    const values = form.getValues();
    if (!values.rawUrl) {
      return;
    }

    const [valid, response] = await Promise.all([
      form.trigger("rawUrl"),
      getUrlInfo({
        variables: { input: { rawUrl: values.rawUrl } },
      }),
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

    form.clearErrors("rawUrl");
    form.setValue("videoInfo", response.data.urlInformation, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: FormValues) => {
    const { data } = await createVideo({
      variables: {
        input: {
          playlistID,
          rawUrl: values.rawUrl,
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

          {videoInfo && (
            <div className="w-full flex flex-col">
              <Label>Preview</Label>

              <div className="aspect-video mt-2">
                <ReactPlayer controls url={videoInfo.url} width="100%" height="100%" />
              </div>
            </div>
          )}
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
