import React from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";
import { Form } from "@ui/components/ui/form";

import { Route } from "~routes/p/$playlistID/edit.lazy";

import { gql } from "../../../../__generated__";
import { EditPlaylistItemsQuery } from "../../../../__generated__/graphql";

const CREATE_PLAYLIST_ITEM_MUTATION = gql(/* GraphQL */ `
  mutation CreatePlaylistItem($input: CreatePlaylistItemInput!) {
    createPlaylistItem(input: $input) {
      id
      kind
      title
      thumbnailUrl
      rawUrl
    }
  }
`);

const schema = z.object({
  rawURL: z.string().min(1).url(),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  onAdd: (video: EditPlaylistItemsQuery["playlist"]["items"][number]) => void;
};

export function AddVideo({ onAdd }: Props) {
  const { playlistID } = Route.useParams();

  const [createVideo, { loading }] = useMutation(CREATE_PLAYLIST_ITEM_MUTATION);

  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onCancel = () => {
    setOpen(false);
    form.reset({ rawURL: "" });
  };

  const onSubmit = async (values: FormValues) => {
    const { data } = await createVideo({
      variables: { input: { playlistID, rawUrl: values.rawURL } },
    });
    if (!data) {
      return;
    }

    form.reset({ rawURL: "" });
    onAdd(data.createPlaylistItem);
    setOpen(false);
  };

  return (
    <>
      {!open && (
        <Button variant="default" onClick={() => setOpen(true)}>
          Add <Plus className="ml-1 w-4 h-4" />
        </Button>
      )}

      {open && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-center gap-4"
          >
            <InputFormItem
              control={form.control}
              name="rawURL"
              label="Add new URL from video"
              placeholder="URL"
              className="w-full"
            />

            <div className="flex gap-2">
              <Button variant="outline" type="reset" onClick={onCancel}>
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                Add
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
