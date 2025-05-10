import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputFormItem } from "@ui/components/form/input-form-item.js";
import { SelectFormItem } from "@ui/components/form/select-form-item.js";
import { Button } from "@ui/components/ui/button.js";
import { Form, FormControl } from "@ui/components/ui/form.js";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/ui/select";

import {
  PlaylistNewItemsPosition,
  PlaylistViewQuery,
  UpdatePlaylistDocument,
} from "~common/graphql-types.js";

const schema = z.object({
  name: z.string().min(1),
  newItemsPosition: z.nativeEnum(PlaylistNewItemsPosition),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  playlist: PlaylistViewQuery["playlist"];
  onClose: () => void;
};

export function EditPlaylistForm({ playlist, onClose }: Props) {
  const [updatePlaylist, { loading }] = useMutation(UpdatePlaylistDocument);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: playlist.name, newItemsPosition: playlist.newItemsPosition },
  });

  const onSubmit = async (values: FormValues) => {
    await updatePlaylist({ variables: { input: { id: playlist.id, ...values } } });

    onClose();
  };

  return (
    <Form {...form}>
      <form
        id="update-playlist"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-4"
      >
        <InputFormItem
          autoFocus
          autoComplete="off"
          disabled={loading}
          control={form.control}
          name="name"
          label="Playlist name"
          placeholder="My playlist"
          className="w-full"
        />

        <SelectFormItem control={form.control} name="newItemsPosition" label="New items position">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a sort order" />
            </SelectTrigger>
          </FormControl>

          <SelectContent>
            <SelectItem value={PlaylistNewItemsPosition.Bottom}>Bottom</SelectItem>
            <SelectItem value={PlaylistNewItemsPosition.Top}>Top</SelectItem>
          </SelectContent>
        </SelectFormItem>

        <div className="flex flex-row items-center gap-2 self-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            form="update-playlist"
            disabled={!form.formState.isValid || loading}
          >
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}
