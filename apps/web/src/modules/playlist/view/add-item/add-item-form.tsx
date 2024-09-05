import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLazyQuery, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";
import { DialogClose, DialogFooter } from "@ui/components/ui/dialog";
import { Form } from "@ui/components/ui/form";

import { PlaylistItemKindBadge } from "~components/playlist-item-kind-badge";
import {
  AddItemUrlInformationDocument,
  CreatePlaylistItemDocument,
  PlaylistViewDocument,
} from "~graphql/types";
import { Route } from "~routes/p/$playlistID/index.lazy";

const schema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
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
    defaultValues: { url: "" },
  });

  const onBlur = async () => {
    const [valid, response] = await Promise.all([
      form.trigger("url"),
      getUrlInfo({ variables: { url: form.getValues("url") } }),
    ]);

    if (!valid) {
      return;
    }
    if (!response.data?.urlInformation) {
      form.setError("url", { type: "value", message: "No video found!" });
      return;
    }

    form.setValue("title", response.data.urlInformation.title, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: FormValues) => {
    const { data } = await createVideo({
      variables: { input: { playlistID, rawUrl: values.url } },
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
            name="url"
            label="Add new URL from video"
            placeholder="URL"
            className="w-full"
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

            <PlaylistItemKindBadge kind={urlData.urlInformation.kind} />
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
