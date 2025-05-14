import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputFormItem } from "@ui/components/form/input-form-item.js";
import { SelectFormItem } from "@ui/components/form/select-form-item";
import { Button } from "@ui/components/ui/button.js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog.js";
import { Form, FormControl } from "@ui/components/ui/form.js";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/ui/select";

import {
  CreatePlaylistDocument,
  PlaylistNewItemsPosition,
  UserViewDocument,
} from "~common/graphql-types.js";
import { Route } from "~routes/index.js";

const schema = z.object({
  name: z.string().min(1),
  newItemsPosition: z.nativeEnum(PlaylistNewItemsPosition),
  url: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function CreatePlaylist() {
  const navigate = Route.useNavigate();
  const [open, setOpen] = React.useState(false);

  const [createPlaylist, { loading }] = useMutation(CreatePlaylistDocument, {
    refetchQueries: [UserViewDocument],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      newItemsPosition: PlaylistNewItemsPosition.Bottom,
      url: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const { data } = await createPlaylist({
      variables: { input: values },
    });

    if (!data) {
      return;
    }

    form.reset();
    navigate({ to: "/p/$playlistID", params: { playlistID: data.createPlaylist.id } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="self-end">
          Create playlist
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create playlist</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="create-playlist"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center gap-4"
          >
            <InputFormItem
              autoComplete="off"
              control={form.control}
              name="name"
              label="Name"
              placeholder="My playlist"
            />

            <SelectFormItem
              control={form.control}
              name="newItemsPosition"
              label="New items position"
            >
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

            <InputFormItem
              autoComplete="off"
              control={form.control}
              name="url"
              label="URL"
              description="Copy from a YouTube playlist or Subreddit"
              placeholder="https://reddit.com/r/videos"
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
            form="create-playlist"
            disabled={!form.formState.isValid || loading}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
