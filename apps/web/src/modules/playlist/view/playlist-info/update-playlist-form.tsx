import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";
import { Form } from "@ui/components/ui/form";

import { PlaylistViewQuery, UpdatePlaylistDocument } from "~common/graphql-types";

const schema = z.object({
  name: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  playlist: PlaylistViewQuery["playlist"];
  onClose: () => void;
};

export function UpdatePlaylistForm({ playlist, onClose }: Props) {
  const [updatePlaylist, { loading }] = useMutation(UpdatePlaylistDocument);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: playlist.name },
  });

  const onSubmit = async (values: FormValues) => {
    await updatePlaylist({
      variables: { input: { id: playlist.id, name: values.name } },
    });

    onClose();
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Form {...form}>
        <form
          id="update-playlist"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center gap-4"
        >
          <InputFormItem
            autoFocus
            autoComplete="off"
            disabled={loading}
            control={form.control}
            name="name"
            placeholder="My playlist"
            className="w-full"
          />
        </form>
      </Form>

      <div className="flex flex-row items-center self-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" form="update-playlist" disabled={!form.formState.isValid || loading}>
          Update
        </Button>
      </div>
    </div>
  );
}
