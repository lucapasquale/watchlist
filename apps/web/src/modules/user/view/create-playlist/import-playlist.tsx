import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputFormItem } from "@ui/components/form/input-form-item.js";
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
import { Form } from "@ui/components/ui/form.js";

import { ImportPlaylistDocument, UserPlaylistsDocument } from "~common/graphql-types.js";
import { Route } from "~routes/index.js";

const schema = z.object({
  href: z.url(),
});
type FormValues = z.infer<typeof schema>;

export function ImportPlaylist() {
  const navigate = Route.useNavigate();
  const [open, setOpen] = React.useState(false);

  const [importPlaylist, { loading }] = useMutation(ImportPlaylistDocument, {
    refetchQueries: [UserPlaylistsDocument],
    awaitRefetchQueries: true,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { href: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const { data } = await importPlaylist({
      variables: { input: values },
    });

    if (!data) {
      return;
    }

    form.reset();
    navigate({ to: "/playlist/$playlistID", params: { playlistID: data.importPlaylist.id } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="self-end">
          Import
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import playlist</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="import-playlist"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center gap-4"
          >
            <InputFormItem
              required
              autoComplete="off"
              control={form.control}
              name="href"
              label="URL"
              placeholder="https://reddit.com/r/videos"
              description="Import a playlist from YouTube, a subreddit, or from Twitch clips"
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
            form="import-playlist"
            disabled={!form.formState.isValid}
            loading={loading}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
